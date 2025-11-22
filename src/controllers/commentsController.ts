import { Request, Response, NextFunction } from "express";
import * as commentsService from "../services/commentsService";

export const getComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const commentId = req.params.id;
        const comment = await commentsService.getComment(commentId);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        res.json(comment);
    } catch (error) {
        next(error);
    }
};

export const addComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const { content } = req.body;
        
        if (typeof content !== 'string' || content.trim().length === 0) {
            res.status(400).json({ message: 'Content must be a non-empty string' });
            return;
        }
        
        const commentObj = { content };
        const newComment = await commentsService.addComment(commentObj);
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const commentId = req.params.id;
        const deleted = await commentsService.deleteComment(commentId);
        if (deleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        next(error);
    }
};

export const editComment = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
        const commentId = req.params.id;
        const content = req.body;
        const updatedComment = await commentsService.editComment(commentId, content);
        if (!updatedComment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.json(updatedComment);
    } catch (error) {
        next(error);
    }
};
