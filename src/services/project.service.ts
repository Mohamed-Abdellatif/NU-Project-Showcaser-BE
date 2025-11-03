import { IProject, Project } from '../models/Project';

export const getAllProjects = async (): Promise<IProject[]> => {
  return await Project.find({});
};

export const createProject = async (projectData: Partial<IProject>): Promise<IProject> => {
  const project = new Project(projectData);
  return await project.save();
};

export const getProjectById = async (id: string): Promise<IProject | null> => {
  return await Project.findById(id);
};
