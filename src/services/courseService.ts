import { ICourse, Course } from '../models/courseModel';

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CourseAdminFilters {
  code?: string;
  title?: string;
}

export const getAllCourses = async (filters?: { code?: string; title?: string }): Promise<ICourse[]> => {
    const filterQuery: Record<string, unknown> = {};
    const orConditions: Record<string, unknown>[] = [];

    if (filters?.code) {
        orConditions.push({ code: { $regex: filters.code, $options: "i" } });
    }
    if (filters?.title) {
        orConditions.push({ title: { $regex: filters.title, $options: "i" } });
    }

    // Apply OR logic if filters exist
    if (orConditions.length > 0) {
        filterQuery.$or = orConditions;
    }

    return await Course.find(filterQuery).sort({ createdAt: -1 });
};

export const getAllCoursesByAdmin = async (
  page: number = 1,
  limit: number = 10,
  filters?: CourseAdminFilters
): Promise<PaginatedResult<ICourse>> => {
  const skip = (page - 1) * limit;

  // Build filter query with OR logic
  const filterQuery: Record<string, unknown> = {};
  const orConditions: Record<string, unknown>[] = [];

  if (filters?.code) {
    orConditions.push({ code: { $regex: filters.code, $options: "i" } });
  }
  if (filters?.title) {
    orConditions.push({ title: { $regex: filters.title, $options: "i" } });
  }

  // Apply OR logic if filters exist
  if (orConditions.length > 0) {
    filterQuery.$or = orConditions;
  }

  const [data, total] = await Promise.all([
    Course.find(filterQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Course.countDocuments(filterQuery),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const addCourse = async (courseData: ICourse): Promise<ICourse> => {
    const newCourse = new Course(courseData);
    return await newCourse.save();
};

export const updateCourseByAdmin = async (
  courseId: string,
  courseData: Partial<ICourse>
): Promise<ICourse | null> => {
  return await Course.findByIdAndUpdate(courseId, courseData, { new: true });
};

export const deleteCourseByAdmin = async (courseId: string): Promise<void> => {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
        throw new Error("Course not found");
    }
};
