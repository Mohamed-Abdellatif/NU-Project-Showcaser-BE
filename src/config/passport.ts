import passport from "passport";
import { OIDCStrategy } from "passport-azure-ad";
import userModel from "../models/userModel";

// Configure the Azure AD OIDC strategy using environment variables
export function configurePassport(): void {
  const tenantId = process.env.AZURE_TENANT_ID as string;
  const clientId = process.env.AZURE_CLIENT_ID as string;
  const clientSecret = process.env.AZURE_CLIENT_SECRET as string;
  const redirectUrl = process.env.AZURE_REDIRECT_URL as string;

  if (!tenantId || !clientId || !clientSecret || !redirectUrl) {
    throw new Error("Missing Azure AD configuration environment variables");
  }

  passport.use(
    new OIDCStrategy(
      {
        identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
        clientID: clientId,
        responseType: "code",
        responseMode: "query",
        redirectUrl,
        clientSecret,
        scope: ["openid", "profile", "email"],
        // Allow http redirect only in development to satisfy local testing
        allowHttpForRedirectUrl: process.env.NODE_ENV !== "production",
        passReqToCallback: true,
      },
      async (
        req: any,
        iss: string,
        sub: string,
        profile: any,
        accessToken: string,
        refreshToken: string,
        done: (err: unknown, user?: unknown) => void
      ) => {
        try {
          let firstLogin = false;
          const email =
            profile?._json?.preferred_username || profile?.emails?.[0]?.value;
          let firstName =
            profile?.name?.givenName || profile?._json?.given_name || "";
          let lastName =
            profile?.name?.familyName || profile?._json?.family_name || "";
          const displayName =
            (profile as any)?.displayName || profile?._json?.name || "";
          if ((!firstName || !lastName) && displayName) {
            const parts = String(displayName).trim().split(/\s+/);
            if (!firstName && parts[0]) firstName = parts[0];
            if (!lastName && parts.length > 1)
              lastName = parts.slice(1).join(" ");
          }
          if (!firstName && email) {
            firstName = String(email).split("@")[0];
          }
          const msId = profile?.oid || profile?.id || sub;

          if (!email)
            return done(new Error("Email not provided by Microsoft profile"));

          let user = await userModel.findOne({ $or: [{ msId }, { email }] });
          const role = /\d/.test(email) ? "student" : "supervisor";
          if (!user) {
            user = new userModel({ email, firstName, lastName, msId, role });
            firstLogin = true;
          } else {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.msId = user.msId || msId;
          }
          await user.save();

          return done(null, {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            firstLogin,
          });
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj: unknown, done) => {
    done(null, obj as Express.User);
  });
}

export default passport;
