import { Request, Response, NextFunction } from 'express';
import { IProject } from '../models/projectModel';
import * as projectService from '../services/projectService';

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request<{}, {}, IProject>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request<{ id: string }, {}, IProject>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.deleteProject(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProjectByTitle = async (
  req: Request<{ title: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.getProjectByTitle(req.params.title);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectByMajor = async (
  req: Request<{ major: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await projectService.getProjectByMajor(req.params.major);
    res.json(projects); // Return empty array if no matches
  } catch (error) {
    next(error);
  }
};

export const getProjectBySupervisor = async (
  req: Request<{ supervisor: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.getProjectBySupervisor(req.params.supervisor);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectByTeamMember = async (
  req: Request<{ teamMember: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await projectService.getProjectByTeamMember(req.params.teamMember);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByTeamLeader = async (
  req: Request<{ teamLeader: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.getProjectByTeamLeader(req.params.teamLeader);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};
