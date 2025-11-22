import { Schema, model, Document } from 'mongoose';

// Interface for the Project document
export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  teamLeader: string;
  teamMembers: string[];
  supervisor: string;
  stars: number;
  tags: string[];
  course: string;
  images: string[];
  videos: string[];
  repoUrl: string;
  liveUrl: string;
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
  teamLeader: {
    type: String,
    required: true,
    trim: true
  },
  teamMembers: [{
    type: String,
    trim: true
  }],
  supervisor: {
    type: String,
    required: true,
    trim: true
  },
  stars: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  course: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  videos: [{
    type: String,
    trim: true
  }],
  repoUrl: {
    type: String,
    trim: true
  },
  liveUrl: {
    type: String,
    trim: true
  }
},
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  });

// Export the model and its interface
export const Project = model<IProject>('Project', projectSchema);
