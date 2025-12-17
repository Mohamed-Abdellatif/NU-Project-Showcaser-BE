import { Request, Response, NextFunction } from "express";
import { ISuggestion } from "../models/suggestionModel";
import * as suggestionService from "../services/suggestionService";

export const createSuggestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suggestionData: Partial<ISuggestion> = req.body;
    const newSuggestion = await suggestionService.createSuggestion(
      suggestionData
    );
    res.status(201).json(newSuggestion);
  } catch (error) {
    next(error);
  }
};

export const getAllSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suggestions = await suggestionService.getAllSuggestions();
    res.status(200).json(suggestions);
  } catch (error) {
    next(error);
  }
};

export const getSuggestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suggestionId = req.params.id;
    const suggestion = await suggestionService.getSuggestionById(suggestionId);
    if (suggestion) {
      res.status(200).json(suggestion);
    } else {
      res.status(404).json({ message: "Suggestion not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllSuggestionsByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suggestions = await suggestionService.getAllSuggestionsByAdmin();
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

export const getSuggestionByAdmin = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suggestion = await suggestionService.getSuggestionByAdmin(req.params.id);
    if (!suggestion) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }
    res.json(suggestion);
  } catch (error) {
    next(error);
  }
};

export const editSuggestionByAdmin = async (
  req: Request<{ suggestionId: string }, {}, Partial<ISuggestion>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suggestion = await suggestionService.editSuggestionByAdmin(req.params.suggestionId, req.body);
    if (!suggestion) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }
    res.json(suggestion);
  } catch (error) {
    next(error);
  }
};

export const deleteSuggestionByAdmin = async (
  req: Request<{ suggestionId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suggestion = await suggestionService.deleteSuggestionByAdmin(req.params.suggestionId);
    if (!suggestion) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }
    res.json({ message: "Suggestion deleted successfully" });
  } catch (error) {
    next(error);
  }
};