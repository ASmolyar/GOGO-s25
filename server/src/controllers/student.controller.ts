/**
 * Defines the controller functions for student operations.
 */
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Assignment } from '../models/assignment.model.ts';
import { Submission } from '../models/submission.model.ts';
import { IUser } from '../models/user.model.ts';

/**
 * Get all assignments available to students
 */
export const getAllAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const assignments = await Assignment.find()
      .sort({ dueDate: 1 })
      .populate('createdBy', 'firstName lastName');

    return res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get a single assignment by ID
 */
export const getAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    const assignment = await Assignment.findById(id).populate(
      'createdBy',
      'firstName lastName',
    );

    if (!assignment) {
      return next(createError(404, 'Assignment not found'));
    }

    // Check if the student has already submitted
    const existingSubmission = await Submission.findOne({
      assignment: id,
      student: user._id,
    });

    return res.status(200).json({
      success: true,
      data: {
        assignment,
        hasSubmitted: !!existingSubmission,
        submission: existingSubmission,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Submit work for an assignment
 */
export const submitAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user as IUser;

    if (!content) {
      return next(createError(400, 'Content is required'));
    }

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return next(createError(404, 'Assignment not found'));
    }

    // Check if the due date has passed
    if (new Date() > new Date(assignment.dueDate)) {
      return next(
        createError(400, 'The due date for this assignment has passed'),
      );
    }

    // Check if the student has already submitted
    const existingSubmission = await Submission.findOne({
      assignment: id,
      student: user._id,
    });

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.content = content;
      existingSubmission.submittedAt = new Date();
      await existingSubmission.save();

      return res.status(200).json({
        success: true,
        data: existingSubmission,
        message: 'Submission updated successfully',
      });
    }

    // Create new submission
    const submission = new Submission({
      assignment: id,
      student: user._id,
      content,
    });

    await submission.save();

    return res.status(201).json({
      success: true,
      data: submission,
      message: 'Assignment submitted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all submissions made by the student
 */
export const getStudentSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUser;

    const submissions = await Submission.find({ student: user._id })
      .populate({
        path: 'assignment',
        populate: {
          path: 'createdBy',
          select: 'firstName lastName',
        },
      })
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    return next(error);
  }
};
