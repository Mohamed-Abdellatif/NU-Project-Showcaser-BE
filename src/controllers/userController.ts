import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

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
