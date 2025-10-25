import { Request, Response, NextFunction } from 'express';
import { IProject } from '../models/Project';
import * as projectService from '../services/project.service';

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
