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
