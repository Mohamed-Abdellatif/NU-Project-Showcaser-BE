import { Request, Response, NextFunction } from 'express';
import * as uploadService from '../services/uploadService';

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if files array exists (multiple files) or single file
    const files = req.files as Express.Multer.File[] | undefined;
    const singleFile = req.file;

    if (!files && !singleFile) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    // Handle multiple files
    if (files && files.length > 0) {
      const result = await uploadService.uploadMultipleFiles(files, 'images');
      res.json(result);
      return;
    }

    // Handle single file
    if (singleFile) {
      const result = await uploadService.uploadFile(singleFile, 'images');
      res.json(result);
      return;
    }

    res.status(400).json({ error: 'No file provided' });
  } catch (error) {
    // Return 400 status for upload errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(400).json({ error: errorMessage });
  }
};

export const uploadVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const result = await uploadService.uploadFile(req.file, 'videos');
    res.json(result);
  } catch (error) {
    // Return 400 status for upload errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(400).json({ error: errorMessage });
  }
};

