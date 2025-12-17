import { Request, Response, NextFunction } from 'express';
import { ensureAuthenticated } from './authGuard';
import { findDbUserFromSessionUser } from '../services/authService';

/**
 * Middleware to ensure user is authenticated AND has admin role
 * Must be used after ensureAuthenticated or jwtCookieAuth middleware
 */
export function ensureAdmin(req: Request, res: Response, next: NextFunction): void {
  // First check if user is authenticated
  const isAuthenticated = (typeof (req as any).isAuthenticated === 'function' && (req as any).isAuthenticated()) || (req as any).user;
  
  if (!isAuthenticated) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // Get user from request (could be from Passport session or JWT)
  const sessionUser = (req as any).user as
    | { sub?: string; id?: string; email?: string; role?: string }
    | undefined;

  // Check if role is already in the user object (from JWT)
  if (sessionUser?.role === 'admin') {
    next();
    return;
  }

  // If role not in session/JWT, fetch from database
  findDbUserFromSessionUser(sessionUser)
    .then((dbUser) => {
      if (!dbUser) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      if (dbUser.role !== 'admin') {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
        return;
      }

      // Attach full user to request for downstream use
      (req as any).user = dbUser;
      next();
    })
    .catch((error) => {
      console.error('Error checking admin role:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

