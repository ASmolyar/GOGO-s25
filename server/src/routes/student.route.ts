/**
 * Specifies the middleware and controller functions to call for each route
 * relating to student operations.
 */
import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware.ts';
import { isStudent } from '../controllers/role.middleware.ts';
import {
  getAllAssignments,
  getAssignment,
  submitAssignment,
  getStudentSubmissions,
} from '../controllers/student.controller.ts';

const router = express.Router();

// Apply authentication and role middleware to all routes
router.use(isAuthenticated, isStudent);

/**
 * Routes for viewing assignments
 */
router.get('/assignments', getAllAssignments);
router.get('/assignments/:id', getAssignment);

/**
 * Routes for managing submissions
 */
router.post('/assignments/:id/submit', submitAssignment);
router.get('/submissions', getStudentSubmissions);

export default router; 