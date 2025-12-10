import { Request, Response, NextFunction } from "express";
import * as commentsService from "../services/commentService";

export const getComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentId = req.params.id;
    const comment = await commentsService.getComment(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentObj = req.body;
    const newComment = await commentsService.addComment(commentObj);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const commentId = req.params.id;
    const content = req.body;
    const updatedComment = await commentsService.editComment(
      commentId,
      content
    );
    if (!updatedComment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const getCommentsByProjectId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projectId = req.params.id;
    const comments = await commentsService.getCommentsByProjectId(projectId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const getAllCommentsByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comments = await commentsService.getAllCommentsByAdmin();
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const getCommentByAdmin = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await commentsService.getCommentByAdmin(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const editCommentByAdmin = async (
  req: Request<{ commentId: string }, {}, Partial<import("../models/commentModel").IComment>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await commentsService.editCommentByAdmin(req.params.commentId, req.body);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteCommentByAdmin = async (
  req: Request<{ commentId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await commentsService.deleteCommentByAdmin(req.params.commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};