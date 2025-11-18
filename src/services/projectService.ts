import { IProject, Project } from '../models/projectModel';

export const getAllProjects = async (): Promise<IProject[]> => {
  return await Project.find({});
};

export const createProject = async (projectData: Partial<IProject>): Promise<IProject> => {
  const project = new Project(projectData);
  return await project.save();
};

export const createMultipleProjects = async (projectsData: Partial<IProject>[]): Promise<IProject[]> => {
  const projects = await Project.insertMany(projectsData);
  return projects as IProject[];
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
    orConditions.push({ 
      title: { $regex: criteria.title, $options: 'i' } 
    });
  }
  if (criteria.major) {
    orConditions.push({ 
      major: { $regex: criteria.major, $options: 'i' } 
    });
  }
  if (criteria.supervisor) {
    orConditions.push({ 
      supervisor: { $regex: criteria.supervisor, $options: 'i' } 
    });
  }
  if (criteria.teamMember) {
    orConditions.push({ 
      teamMembers: { $regex: criteria.teamMember, $options: 'i' } 
    });
  }
  if (criteria.teamLeader) {
    orConditions.push({ 
      teamLeader: { $regex: criteria.teamLeader, $options: 'i' } 
    });
  }

  if (orConditions.length === 0) {
    return await Project.find({});
  }

  return await Project.find({ $or: orConditions });
};

export const getFeaturedProjects = async (): Promise<IProject[]> => {
  return await Project.find({})
    .sort({ stars: -1 })
    .limit(6);
};

export interface PaginatedProjectsResult {
  projects: IProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getProjects = async (
  page: number = 1,
  limit: number = 10,
  filters?: ProjectSearchCriteria
): Promise<PaginatedProjectsResult> => {
  const skip = (page - 1) * limit;
  
  // Build filter query with AND logic (all filters must match)
  const filterQuery: Record<string, unknown> = {};
  
  if (filters?.title) {
    filterQuery.title = { $regex: filters.title, $options: 'i' };
  }
  if (filters?.major) {
    filterQuery.course = { $regex: filters.major, $options: 'i' };
  }
  if (filters?.supervisor) {
    filterQuery.supervisor = { $regex: filters.supervisor, $options: 'i' };
  }
  if (filters?.teamMember) {
    filterQuery.teamMembers = { $regex: filters.teamMember, $options: 'i' };
  }
  if (filters?.teamLeader) {
    filterQuery.teamLeader = { $regex: filters.teamLeader, $options: 'i' };
  }
  
  const [projects, total] = await Promise.all([
    Project.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filterQuery)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};