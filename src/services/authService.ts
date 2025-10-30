import jwt from 'jsonwebtoken';
import userModel, { IUser } from '../models/userModel';
import { Request, Response } from 'express';

type BasicUser = { id?: string; email?: string; firstName?: string; lastName?: string };

export async function upsertMicrosoftUser(profile: any, sub: string): Promise<IUser> {
  const email = profile?._json?.preferred_username || profile?.emails?.[0]?.value;
  let firstName = profile?.name?.givenName || profile?._json?.given_name || '';
  let lastName = profile?.name?.familyName || profile?._json?.family_name || '';
  const displayName = (profile as any)?.displayName || profile?._json?.name || '';
  if ((!firstName || !lastName) && displayName) {
    const parts = String(displayName).trim().split(/\s+/);
    if (!firstName && parts[0]) firstName = parts[0];
    if (!lastName && parts.length > 1) lastName = parts.slice(1).join(' ');
  }
  if (!firstName && email) firstName = String(email).split('@')[0];
  const msId = profile?.oid || profile?.id || sub;

  let user = await userModel.findOne({ $or: [{ msId }, { email }] });
  if (!user) {
    user = new userModel({ email, firstName, lastName, msId });
  } else {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.msId = user.msId || msId;
  }
  await user.save();
  return user;
}

export function generateJwtForUser(user: { id: string; email: string; firstName?: string; lastName?: string }): string {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) throw new Error('JWT secret not configured');
  return jwt.sign(
    { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
    jwtSecret,
    { expiresIn: '8h' }
  );
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 8
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
}

export function isAjaxOrFetch(req: Request): boolean {
  return (
    req.headers['x-requested-with'] === 'XMLHttpRequest' ||
    (typeof req.headers.accept === 'string' && req.headers.accept.includes('application/json')) ||
    req.headers['sec-fetch-mode'] === 'cors'
  );
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


