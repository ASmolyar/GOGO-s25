/**
 * Defines the Submission model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';
import { IUser } from './user.model.ts';
import { IAssignment } from './assignment.model.ts';

const SubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  grade: {
    type: Number,
    required: false,
  },
  feedback: {
    type: String,
    required: false,
  },
});

interface ISubmission extends mongoose.Document {
  _id: string;
  assignment: IAssignment['_id'] | IAssignment;
  student: IUser['_id'] | IUser;
  content: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);

export { ISubmission, Submission };
