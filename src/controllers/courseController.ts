import { Request, Response, NextFunction } from 'express';
import { ICourse } from '../models/courseModel';
import * as courseService from '../services/courseService';

export const addCourse = async (
  req: Request<{}, {}, ICourse>,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await courseService.addCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};
