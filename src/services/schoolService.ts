import { ISchool, School } from "../models/schoolModel";

export const getAllSchools = async (): Promise<ISchool[]> => {
    return await School.find();
};

export const createSchool = async (schoolData: ISchool): Promise<ISchool> => {
    const newSchool = new School(schoolData);
    return await newSchool.save();
};

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface SchoolAdminFilters {
    name?: string;
    majors?: string;
}

export const getAllSchoolsByAdmin = async (
    page: number = 1,
    limit: number = 10,
    filters?: SchoolAdminFilters
): Promise<PaginatedResult<ISchool>> => {
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery: Record<string, unknown> = {};

    if (filters?.name) {
        filterQuery.name = { $regex: filters.name, $options: "i" };
    }
    if (filters?.majors) {
        filterQuery.majors = { $in: [new RegExp(filters.majors, "i")] };
    }

    const [data, total] = await Promise.all([
        School.find(filterQuery).sort({ name: 1 }).skip(skip).limit(limit),
        School.countDocuments(filterQuery),
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

export const getSchoolByAdmin = async (id: string): Promise<ISchool | null> => {
    return await School.findById(id);
};

export const editSchoolByAdmin = async (
    schoolId: string,
    schoolData: Partial<ISchool>
): Promise<ISchool | null> => {
    return await School.findByIdAndUpdate(schoolId, schoolData, { new: true });
};

export const deleteSchoolByAdmin = async (schoolId: string): Promise<ISchool | null> => {
    return await School.findByIdAndDelete(schoolId);
};