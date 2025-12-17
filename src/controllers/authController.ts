import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  findDbUserFromSessionUser,
  clearAuthCookies,
} from "../services/authService";
import userModel from "../models/userModel";

export const loginSuccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sessionUser = (req as any).user as
    | { sub?: string; id?: string; email?: string; firstLogin?: boolean }
    | undefined;

  if (!sessionUser) {
    res.redirect(
      process.env.FRONTEND_HOME_URL || "http://localhost:5173/"
    );
    return;
  }

  // Issue a JWT auth cookie so the frontend can authenticate via cookies
  // without depending on cross-domain Passport sessions.
  const dbUser = await findDbUserFromSessionUser(sessionUser);
  if (dbUser) {
    const tokenPayload = {
      id: dbUser.id,
      email: dbUser.email,
      role: (dbUser as any).role,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET must be set");
    }

    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: "7d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
  }

  if (sessionUser?.firstLogin) {
    const redirectUrl =
      process.env.FRONTEND_FIRST_LOGIN_REDIRECT_URL ||
      "http://localhost:5173/complete-profile";
    res.redirect(redirectUrl);
    return;
  } else {
    const dashboardUrl =
      process.env.FRONTEND_DASHBOARD_URL || "http://localhost:5173/";
    res.redirect(dashboardUrl);
  }
};

export const profile = (req: Request, res: Response): void => {
  res.json((req as any).user ?? null);
};

export const me = async (req: Request, res: Response): Promise<void> => {
  const sessionUser = (req as any).user as
    | { sub?: string; id?: string; email?: string }
    | undefined;
  if (!sessionUser) {
    res.status(200).json({ authenticated: false });
    return;
  }
  const dbUser = await findDbUserFromSessionUser(sessionUser);
  if (!dbUser) {
    res.status(200).json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true, user: dbUser });
};

export const logout = (req: Request, res: Response): void => {
  const homeUrl = process.env.FRONTEND_HOME_URL || "http://localhost:5173/";
  const aadLogoutBase =
    "https://login.microsoftonline.com/common/oauth2/v2.0/logout";
  
  // Check if this is an API request (Accept: application/json) or browser navigation
  const isApiRequest = req.headers.accept?.includes("application/json") || 
                       req.query.format === "json";
  
  const finish = () => {
    req.session?.destroy(() => {
      // Clear session cookie with proper cross-domain options
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
      });
      clearAuthCookies(res);
      
      // Build Microsoft logout URL
      const postLogout = encodeURIComponent(homeUrl);
      const logoutUrl = `${aadLogoutBase}?post_logout_redirect_uri=${postLogout}`;
      
      // If API request, return JSON. Otherwise redirect (browser navigation)
      if (isApiRequest) {
        res.json({ 
          success: true, 
          logoutUrl,
          message: "Logged out successfully" 
        });
      } else {
        // Direct browser navigation - redirect to Microsoft logout
        res.redirect(logoutUrl);
      }
    });
  };
  
  const doLogout = (req as any).logout;
  if (typeof doLogout === "function") {
    try {
      doLogout(() => finish());
    } catch {
      finish();
    }
  } else {
    finish();
  }
};
