import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminService";

export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await adminService.getAdminStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
