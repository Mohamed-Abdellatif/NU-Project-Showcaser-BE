import { Request, Response } from "express";
import {
  findDbUserFromSessionUser,
  clearAuthCookies,
} from "../services/authService";

export const loginSuccess = (req: Request, res: Response): void => {
  const dashboardUrl =
    process.env.FRONTEND_DASHBOARD_URL || "http://localhost:5173/";
  res.redirect(dashboardUrl);
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
  const finish = () => {
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      clearAuthCookies(res);
      // Always clear AAD session to avoid silent re-login
      const postLogout = encodeURIComponent(homeUrl);
      res.redirect(`${aadLogoutBase}?post_logout_redirect_uri=${postLogout}`);
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
