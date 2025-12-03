import { ISchool, School } from "../models/schoolModel";

export const getAllSchools = async (): Promise<ISchool[]> => {
    return await School.find();
};

export const createSchool = async (schoolData: ISchool): Promise<ISchool> => {
    const newSchool = new School(schoolData);
    return await newSchool.save();
};
