import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
  // Accept either Passport session or a user attached from JWT cookie
  if ((typeof (req as any).isAuthenticated === 'function' && (req as any).isAuthenticated()) || (req as any).user) {
    next();
    return;
  }
  res.status(401).json({ message: 'Not authenticated' });
}


