import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File too large' });
      return;
    }
    res.status(400).json({ error: `Upload error: ${err.message}` });
    return;
  }
  if (err) {
    res.status(400).json({ error: err.message || 'Upload failed' });
    return;
  }
  next();
};

