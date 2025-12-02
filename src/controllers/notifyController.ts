import { Request, Response, NextFunction } from 'express';
import * as notifyService from '../services/notifyService';

export const sendMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { to, subject, text, html } = req.body;

    // Validate required fields
    if (!to || !subject) {
      res.status(400).json({
        error: 'Missing required fields: to and subject are required',
      });
      return;
    }

    const { statusCode, data } = await notifyService.sendMail({
      to,
      subject,
      text,
      html,
    });

    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
};

