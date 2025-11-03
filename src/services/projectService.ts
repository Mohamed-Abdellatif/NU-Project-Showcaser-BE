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

export type ProjectSearchCriteria = {
  title?: string;
  major?: string;
  supervisor?: string;
  teamMember?: string;
  teamLeader?: string;
};

export const searchProjects = async (
  criteria: ProjectSearchCriteria
): Promise<IProject[]> => {
  const orConditions: Record<string, unknown>[] = [];

  if (criteria.title) {
    orConditions.push({ title: criteria.title });
  }
  if (criteria.major) {
    orConditions.push({ major: criteria.major });
  }
  if (criteria.supervisor) {
    orConditions.push({ supervisor: criteria.supervisor });
  }
  if (criteria.teamMember) {
    orConditions.push({ teamMembers: criteria.teamMember });
  }
  if (criteria.teamLeader) {
    orConditions.push({ teamLeader: criteria.teamLeader });
  }

  if (orConditions.length === 0) {
    return await Project.find({});
  }

  return await Project.find({ $or: orConditions });
};