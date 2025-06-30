import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, signin, verifyEmail } from '../controllers/auth.controller.js';
import { resendVerification } from '../controllers/auth.controller.js';


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
  res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
});


router.post('/signup', signup);
router.post('/signin', signin);

router.post('/resend-verification', resendVerification);
router.get('/verify-email/:token', verifyEmail);

export default router;
