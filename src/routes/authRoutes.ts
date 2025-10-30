import { Router } from 'express';
import passport from '../config/passport';
import { loginSuccess, profile, logout, me } from '../controllers/authController';
import { ensureAuthenticated } from '../middlewares/authGuard';

const router = Router();

// Start Microsoft login
router.get('/microsoft', passport.authenticate('azuread-openidconnect'));

// Callback after Microsoft login
router.get(
  '/callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  loginSuccess
);

// Protected profile route
router.get('/profile', ensureAuthenticated, profile);


router.get('/logout', logout); // supports top-level navigation logout

// Auth status endpoint
router.get('/me', me);

export default router;


