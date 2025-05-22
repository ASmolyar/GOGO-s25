/**
 * Specifies the middleware and controller functions to call for each route
 * relating to teacher operations.
 */
import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware.ts';
import { isTeacher } from '../controllers/role.middleware.ts';
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getTeacherAssignments,
  getAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} from '../controllers/teacher.controller.ts';

const router = express.Router();

// Apply authentication and role middleware to all routes
router.use(isAuthenticated, isTeacher);

/**
 * Routes for assignment management
 */
router.post('/assignments', createAssignment);
router.get('/assignments', getTeacherAssignments);
router.get('/assignments/:id', getAssignment);
router.put('/assignments/:id', updateAssignment);
router.delete('/assignments/:id', deleteAssignment);

/**
 * Routes for submission management
 */
router.get('/assignments/:id/submissions', getAssignmentSubmissions);
router.put('/submissions/:id/grade', gradeSubmission);

export default router;
