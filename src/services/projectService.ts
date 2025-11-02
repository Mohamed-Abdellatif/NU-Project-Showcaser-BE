import { IProject, Project } from '../models/projectModel';

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

export const updateProject = async (id: string, projectData: Partial<IProject>): Promise<IProject | null> => {
  return await Project.findByIdAndUpdate(id, projectData, { new: true });
};

export const deleteProject = async (id: string): Promise<IProject | null> => {
  return await Project.findByIdAndDelete(id);
};

export const getProjectByTitle = async (title: string): Promise<IProject | null> => {
  return await Project.findOne({ title: title });
};

export const getProjectByMajor = async (major: string): Promise<IProject[]> => {
  return await Project.find({ major: major });
};

export const getProjectBySupervisor = async (supervisor: string): Promise<IProject[]> => {
  return await Project.find({ supervisor: supervisor });
};

export const getProjectByTeamMember = async (teamMember: string): Promise<IProject[]> => {
  return await Project.find({ teamMembers: teamMember });
};

export const getProjectByTeamLeader = async (teamLeader: string): Promise<IProject[]> => {
  return await Project.find({ teamLeader: teamLeader });
};