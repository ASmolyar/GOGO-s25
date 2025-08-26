/**
  Image model for images in the database
 */


import mongoose from 'mongoose';

const pictureSchema = new mongoose.Schema({
  ImageURL: {
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

interface IPicture extends mongoose.Document {
  Image: string;
  Component: string;
  ID: number;
}

const Picture = mongoose.model<IPicture>('Picture', pictureSchema);

export { IPicture, Picture };
