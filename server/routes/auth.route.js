import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js"
import { signup, signin, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { resendVerification } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

// -- /api/v1/auth

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: false,
}), (req, res) => {
  // After Google login, redirect with token to frontend
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?token=${token}`);
});

router.get('/me', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
});


router.post('/signup', signup);
router.post('/signin', signin);

router.post('/resend-verification', resendVerification);
router.get('/verify-email/:token', verifyEmail);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
