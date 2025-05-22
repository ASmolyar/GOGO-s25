/**
 * Defines the Assignment model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';
import { IUser } from './user.model.ts';

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

interface IAssignment extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  createdBy: IUser['_id'] | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export { IAssignment, Assignment };
