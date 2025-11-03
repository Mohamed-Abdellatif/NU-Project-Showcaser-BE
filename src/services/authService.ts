
import userModel, { IUser } from '../models/userModel';
import { Request, Response } from 'express';


export function clearAuthCookies(res: Response): void {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
}


export async function findDbUserFromSessionUser(sessionUser?: { id?: string; sub?: string; email?: string }) {
  if (!sessionUser) return null;
  const userId = sessionUser.id || sessionUser.sub;
  const email = sessionUser.email;
  const dbUser = userId
    ? await userModel.findById(userId).select('-password')
    : await userModel.findOne({ email }).select('-password');
  return dbUser;
}


