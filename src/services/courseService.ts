import { ICourse, Course } from '../models/courseModel';

export const getAllCourses = async (): Promise<ICourse[]> => {
    return await Course.find();
};

export const addCourse = async (courseData: ICourse): Promise<ICourse> => {
    const newCourse = new Course(courseData);
    return await newCourse.save();
};

export const getCourseByCode = async (code: string): Promise<ICourse | null> => {
    return await Course.findOne({ code });
};

export const deleteCourseByCode = async (code: string): Promise<void> => {
    await Course.deleteOne({ code });
};
