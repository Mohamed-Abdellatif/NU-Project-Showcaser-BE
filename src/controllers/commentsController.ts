import { Request, Response, NextFunction } from "express";
import * as commentsService from "../services/commentsService";

export const getComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const commentId = req.params.id;
        const comment = await commentsService.getComment(commentId);
        res.json(comment);
    } catch (error) {
        next(error);
    }
};

export const addComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const commentBody = req.body;
        const newComment = await commentsService.addComment(commentBody);
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const commentId = req.params.id;
        await commentsService.deleteComment(commentId);
        res.status(201).send();
    } catch (error) {
        next(error);
    }
};

export const editComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const commentId = req.params.id;
        const content = req.body;
        const updatedComment = await commentsService.editComment(commentId, content);
        res.json(updatedComment);
    } catch (error) {
        next(error);
    }
};
