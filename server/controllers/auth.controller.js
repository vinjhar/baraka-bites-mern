import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    await sendVerificationEmail(email, verificationToken);

    const user = await User.create({
      name,
      email,
      password: hashed,
      verificationToken,
    });

    res.status(201).json({ message: 'Signup successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: 'Invalid token' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/email-verified`);
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email to continue.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Signin error', error: err.message });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ message: 'Email already verified' });

    // Generate new token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    user.verificationToken = token;
    await user.save();

    // Send new email
    await sendVerificationEmail(email, token);

    res.status(200).json({ message: 'Verification email resent successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resending verification', error: err.message });
  }
};

export const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
};

export const getProfile = (req, res) => {
  res.json(req.user);
};
