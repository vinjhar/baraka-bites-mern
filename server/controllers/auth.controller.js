import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/sendEmail.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    if (password.length < 8) {
      return res.status(400).json({ message: "Password Length too short!" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await sendVerificationEmail(email, verificationToken);

    const user = await User.create({
      name,
      email,
      password: hashed,
      verificationToken,
    });

    res
      .status(201)
      .json({
        message:
          "Signup successful. Please check your email to verify your account.",
      });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "Invalid token" });
    if (user.isVerified)
      return res.status(400).json({ message: "Email already verified" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/email-verified`);
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email to continue." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Signin error", error: err.message });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "Email already verified" });

    // Generate new token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user.verificationToken = token;
    await user.save();

    // Send new email
    await sendVerificationEmail(email, token);

    res
      .status(200)
      .json({ message: "Verification email resent successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error resending verification", error: err.message });
  }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ error: "No user found with that email" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

  await user.save();

  await sendResetPasswordEmail(user.email, resetToken);

  res.status(200).json({ message: "Reset password link sent to email" });
};

// POST /api/v1/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password has been reset successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const resetDate = user.recipesGeneratedResetAt || new Date();
    const nextResetDate = new Date(resetDate);
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);

    res.status(200).json({
      user,
      nextResetDate: nextResetDate.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -__v").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const updateUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin, isModerator } = req.body;

    if (req.user.id === userId && isAdmin === false) {
      return res
        .status(400)
        .json({ message: "You cannot remove your own admin privileges" });
    }

    const updateFields = {};
    if (typeof isAdmin === "boolean") updateFields.isAdmin = isAdmin;
    if (typeof isModerator === "boolean") updateFields.isModerator = isModerator;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user roles:", error);
    res.status(500).json({ message: "Server error while updating user roles" });
  }
};
