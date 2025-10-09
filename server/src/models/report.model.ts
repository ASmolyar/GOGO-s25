/**
 * Defines the report model for the database and also the interface to
 * access the model in TypeScript.
 */

// made basic template, need to add more fields @aaron

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
});

interface IReport extends mongoose.Document {
  Name: string;
  Address: string;
  Category: string;
}

const Location = mongoose.model<IReport>('Report', reportSchema);

export { IReport, Location };
