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
    const filters = {
      code: req.query.code as string,
      title: req.query.title as string,
    };
    const courses = await courseService.getAllCourses(filters);
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const getAllCoursesByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const filters: courseService.CourseAdminFilters = {
      code: req.query.code as string,
      title: req.query.title as string,
    };

    const result = await courseService.getAllCoursesByAdmin(page, limit, filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateCourseByAdmin = async (
  req: Request<{ courseId: string }, {}, ICourse>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const course = await courseService.updateCourseByAdmin(req.params.courseId, req.body);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourseByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    await courseService.deleteCourseByAdmin(courseId);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
