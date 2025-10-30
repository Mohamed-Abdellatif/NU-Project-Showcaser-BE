import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function jwtCookieAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req as any).cookies?.auth_token as string | undefined;
  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = payload;
  } catch {
    // ignore invalid/expired token, proceed unauthenticated
  }
  next();
}


