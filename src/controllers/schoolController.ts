import { Request, Response, NextFunction } from "express";
import { ISchool } from "../models/schoolModel";
import * as schoolService from "../services/schoolService";

export const getAllSchools = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const schools = await schoolService.getAllSchools();
        res.json(schools);
    } catch (error) {
        next(error);
    }
};

export const createSchool = async (
    req: Request<{}, {}, ISchool>,
    res: Response,
    next: NextFunction
) => {
    try {
        const newSchool = await schoolService.createSchool(req.body);
        res.status(201).json(newSchool);
    } catch (error) {
        next(error);
    }
};

export const getAllSchoolsByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const schools = await schoolService.getAllSchoolsByAdmin();
        res.json(schools);
    } catch (error) {
        next(error);
    }
};

export const getSchoolByAdmin = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const school = await schoolService.getSchoolByAdmin(req.params.id);
        if (!school) {
            res.status(404).json({ message: "School not found" });
            return;
        }
        res.json(school);
    } catch (error) {
        next(error);
    }
};

export const editSchoolByAdmin = async (
    req: Request<{ schoolId: string }, {}, Partial<ISchool>>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const school = await schoolService.editSchoolByAdmin(req.params.schoolId, req.body);
        if (!school) {
            res.status(404).json({ message: "School not found" });
            return;
        }
        res.json(school);
    } catch (error) {
        next(error);
    }
};

export const deleteSchoolByAdmin = async (
    req: Request<{ schoolId: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const school = await schoolService.deleteSchoolByAdmin(req.params.schoolId);
        if (!school) {
            res.status(404).json({ message: "School not found" });
            return;
        }
        res.json({ message: "School deleted successfully" });
    } catch (error) {
        next(error);
    }
};