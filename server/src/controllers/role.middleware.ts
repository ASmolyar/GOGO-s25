/**
 * Defines middleware for role-based permissions.
 */
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { IUser } from '../models/user.model.ts';

/**
 * Middleware to check if the current user is a teacher or admin
 */
export const isTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return next(createError(401, 'You must be logged in'));
    }

    if (user.role === 'teacher' || user.role === 'admin' || user.admin) {
      return next();
    }

    return next(
      createError(403, 'You must be a teacher to access this resource'),
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware to check if the current user is a student
 */
export const isStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return next(createError(401, 'You must be logged in'));
    }

    if (user.role === 'student' || user.role === 'admin' || user.admin) {
      return next();
    }

    return next(
      createError(403, 'You must be a student to access this resource'),
    );
  } catch (error) {
    return next(error);
  }
};
