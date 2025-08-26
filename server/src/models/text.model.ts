/**
  Text model for text in the database
 */


import mongoose from 'mongoose';

const textSchema = new mongoose.Schema({
  textDescription: {
    type: String,
    required: true,
  },
  Component: {
    type: String,
    required: true,
  },
  ID: {
    type: Number,
    required: true,
  }
});

interface IText extends mongoose.Document {
  Image: string;
  Component: string;
  ID: number;
}

const Text = mongoose.model<IText>('Text', textSchema);

export { IText, Text };
