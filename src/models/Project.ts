import { Schema, model, Document } from 'mongoose';

// Interface for the Project document
export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
}

// Project schema definition
const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
},
{
  timestamps:{
    createdAt: true,
    updatedAt: false
  }
});

// Export the model and its interface
export const Project = model<IProject>('Project', projectSchema);
