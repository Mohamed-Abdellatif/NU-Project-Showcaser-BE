import { Schema, model, Document } from 'mongoose';

// Interface for the Course document
export interface ICourse extends Document {
  code: string;
  title: string;
}

// Course schema definition
const courseSchema = new Schema<ICourse>({
  code: { type: String, required: true },
  title: { type: String, required: true }
});

export const Course = model<ICourse>('Course', courseSchema);
