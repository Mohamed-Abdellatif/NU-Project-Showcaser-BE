import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { statusCode, data } = await userService.register({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { statusCode, data } = await userService.login({ email, password });
    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
};

export const completeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
   
    const { statusCode, data } = await userService.completeProfile(req.body);
    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { statusCode, data } = await userService.updateProfile(req.body);
    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { statusCode, data } = await userService.getProfile(req.params.userId);
    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
};

export const requestDeactivate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { statusCode, data } = await userService.requestDeactivate(req.body);
    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllUsersByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.getAllUsersByAdmin();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserByAdmin = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getUserByAdmin(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const editUserByAdmin = async (
  req: Request<{ userId: string }, {}, Partial<import("../models/userModel").IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.editUserByAdmin(req.params.userId, req.body);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserByAdmin = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.deleteUserByAdmin(req.params.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};