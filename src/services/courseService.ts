import { ICourse, Course } from '../models/courseModel';

export const getAllCourses = async (): Promise<ICourse[]> => {
    return await Course.find();
};

export const addCourse = async (courseData: ICourse): Promise<ICourse> => {
    const newCourse = new Course(courseData);
    return await newCourse.save();
};
