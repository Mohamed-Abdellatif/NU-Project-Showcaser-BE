import { Request, Response, NextFunction } from "express";
import { IProject } from "../models/projectModel";
import * as projectService from "../services/projectService";
import * as userService from "../services/userService";
import { findDbUserFromSessionUser } from "../services/authService";

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

export const getProjectById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await projectService.getFeaturedProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createMultipleProjects = async (
  req: Request<{}, {}, IProject[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      res.status(400).json({ message: "Request body must be a non-empty array of projects" });
      return;
    }
    const projects = await projectService.createMultipleProjects(req.body);
    res.status(201).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  req: Request<{}, {}, {}, { 
    page?: string; 
    limit?: string;
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
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const { title, major, supervisor, teamMember, teamLeader } = req.query;

    if (page < 1) {
      res.status(400).json({ message: "Page must be greater than 0" });
      return;
    }

    if (limit < 1 || limit > 100) {
      res.status(400).json({ message: "Limit must be between 1 and 100" });
      return;
    }

    const filters = {
      ...(title && { title }),
      ...(major && { major }),
      ...(supervisor && { supervisor }),
      ...(teamMember && { teamMember }),
      ...(teamLeader && { teamLeader }),
    };

    const result = await projectService.getProjects(page, limit, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProjectStars = async (
  req: Request<{ id: string }, {}, { action?: 'add' | 'remove' }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!action || (action !== 'add' && action !== 'remove')) {
      res.status(400).json({ message: "Action must be either 'add' or 'remove'" });
      return;
    }

    // Get the authenticated user
    const sessionUser = (req as any).user as
      | { sub?: string; id?: string; email?: string }
      | undefined;
    
    if (!sessionUser) {
      res.status(401).json({ message: "User not found in session" });
      return;
    }

    // Find the user in the database
    const dbUser = await findDbUserFromSessionUser(sessionUser);
    if (!dbUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update project stars
    const project = await projectService.updateProjectStars(id, action);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    // Update user's starred projects
    const userId = (dbUser as any)._id?.toString() || (dbUser as any).id?.toString();
    if (!userId) {
      res.status(500).json({ message: "Unable to get user ID" });
      return;
    }
    await userService.updateUserStarredProjects(userId, id, action);

    res.json(project);
  } catch (error) {
    next(error);
  }
};