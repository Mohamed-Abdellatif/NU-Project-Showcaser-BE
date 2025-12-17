import { ISchool, School } from "../models/schoolModel";

export const getAllSchools = async (): Promise<ISchool[]> => {
    return await School.find();
};

export const createSchool = async (schoolData: ISchool): Promise<ISchool> => {
    const newSchool = new School(schoolData);
    return await newSchool.save();
};

export const getAllSchoolsByAdmin = async (): Promise<ISchool[]> => {
    return await School.find({});
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