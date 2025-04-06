/**
 * Defines the controller functions for teacher operations.
 */
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Assignment, IAssignment } from '../models/assignment.model.ts';
import { Submission, ISubmission } from '../models/submission.model.ts';
import { IUser } from '../models/user.model.ts';

/**
 * Create a new assignment
 */
export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, dueDate } = req.body;
    const user = req.user as IUser;

    if (!title || !description || !dueDate) {
      return next(createError(400, 'Missing required fields'));
    }

    const assignment = new Assignment({
      title,
      description,
      dueDate: new Date(dueDate),
      createdBy: user._id,
    });

    await assignment.save();

    return res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing assignment
 */
export const updateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const user = req.user as IUser;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return next(createError(404, 'Assignment not found'));
    }

    // Check if the user is the creator of the assignment
    if (assignment.createdBy.toString() !== user._id.toString() && !user.admin) {
      return next(createError(403, 'You are not authorized to update this assignment'));
    }

    const updatedFields: Partial<IAssignment> = {};

    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (dueDate) updatedFields.dueDate = new Date(dueDate);
    updatedFields.updatedAt = new Date();

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedAssignment,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete an assignment
 */
export const deleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return next(createError(404, 'Assignment not found'));
    }

    // Check if the user is the creator of the assignment
    if (assignment.createdBy.toString() !== user._id.toString() && !user.admin) {
      return next(createError(403, 'You are not authorized to delete this assignment'));
    }

    // Remove all submissions related to this assignment
    await Submission.deleteMany({ assignment: id });

    // Remove the assignment
    await Assignment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all assignments created by the teacher
 */
export const getTeacherAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;

    const assignments = await Assignment.find({ createdBy: user._id }).sort({ createdAt: -1 });

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
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return next(createError(404, 'Assignment not found'));
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get all submissions for a specific assignment
 */
export const getAssignmentSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return next(createError(404, 'Assignment not found'));
    }

    // Check if the user is the creator of the assignment
    if (assignment.createdBy.toString() !== user._id.toString() && !user.admin) {
      return next(createError(403, 'You are not authorized to view these submissions'));
    }

    const submissions = await Submission.find({ assignment: id })
      .populate('student', 'firstName lastName email')
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Grade a submission
 */
export const gradeSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;
    const user = req.user as IUser;

    if (grade === undefined) {
      return next(createError(400, 'Grade is required'));
    }

    const submission = await Submission.findById(id)
      .populate('assignment');

    if (!submission) {
      return next(createError(404, 'Submission not found'));
    }

    // Check if the user is the creator of the related assignment
    const assignment = submission.assignment as IAssignment;
    if (assignment.createdBy.toString() !== user._id.toString() && !user.admin) {
      return next(createError(403, 'You are not authorized to grade this submission'));
    }

    submission.grade = grade;
    if (feedback) submission.feedback = feedback;

    await submission.save();

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    return next(error);
  }
}; 