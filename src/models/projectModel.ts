import { Schema, model, Document } from 'mongoose';

export interface ITeamMember {
  name: string;
  email: string;
}

// Interface for the Project document
export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  teamLeader: ITeamMember;
  teamMembers: ITeamMember[];
  supervisor: string;
  stars: number;
  tags: string[];
  course: string;
  images: string[];
  videos: string[];
  repoUrl: string;
  liveUrl: string;
  status: string;
  teachingAssistant: string;
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
    type: Object,
    required: true,
    trim: true
  },
  teamMembers: [{
    type: Object,
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
  },
  status: {
    type: String,
  },
  teachingAssistant: {
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
