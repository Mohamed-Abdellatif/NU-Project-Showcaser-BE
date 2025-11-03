import { Request, Response, NextFunction } from "express";
import { IProject } from "../models/projectModel";
import * as projectService from "../services/projectService";

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
      res.status(404).json({ message: "Project not found" });
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
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getProjectByTitle = async (
  req: Request<{}, {}, {}, { title?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title } = req.query;
    if (!title) {
      res.status(400).json({ message: "Title query parameter is required" });
      return;
    }
    const project = await projectService.getProjectByTitle(title);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjectByMajor = async (
  req: Request<{}, {}, {}, { major?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { major } = req.query;
    if (!major) {
      res.status(400).json({ message: "Major query parameter is required" });
      return;
    }
    const projects = await projectService.getProjectByMajor(major);
    res.json(projects); // Return empty array if no matches
  } catch (error) {
    next(error);
  }
};

export const getProjectBySupervisor = async (
  req: Request<{}, {}, {}, { supervisor?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { supervisor } = req.query;
    if (!supervisor) {
      res.status(400).json({ message: "Supervisor query parameter is required" });
      return;
    }
    const projects = await projectService.getProjectBySupervisor(supervisor);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByTeamMember = async (
  req: Request<{}, {}, {}, { teamMember?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teamMember } = req.query;
    if (!teamMember) {
      res.status(400).json({ message: "TeamMember query parameter is required" });
      return;
    }
    const projects = await projectService.getProjectByTeamMember(teamMember);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectByTeamLeader = async (
  req: Request<{}, {}, {}, { teamLeader?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teamLeader } = req.query;
    if (!teamLeader) {
      res.status(400).json({ message: "TeamLeader query parameter is required" });
      return;
    }
    const projects = await projectService.getProjectByTeamLeader(teamLeader);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const searchProjects = async (
  req: Request<{}, {}, {}, {
    title?: string;
    major?: string;
    supervisor?: string;
    teamMember?: string;
    teamLeader?: string;
  }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, major, supervisor, teamMember, teamLeader } = req.query;
    const projects = await projectService.searchProjects({
      title,
      major,
      supervisor,
      teamMember,
      teamLeader,
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};
