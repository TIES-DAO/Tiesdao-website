import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔹 Register
export const register = async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Apply referral code if provided
    if (referralCode && referralCode.trim()) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        try {
          // Award points to referrer (100 points per referral)
          referrer.referralPoints += 100;
          referrer.totalPoints = referrer.quizPoints + referrer.referralPoints;
          await referrer.save();

          // Give new user a bonus (50 points)
          user.referralPoints += 50;
          user.totalPoints = user.quizPoints + user.referralPoints;
          await user.save();
        } catch (refErr) {
          console.error("Error applying referral:", refErr);
          // Continue without referral bonus on error
        }
      }
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: process.env.NODE_ENV === "development" ? err.message : undefined });
  }
};

// 🔹 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    let isMatch;
    try {
      isMatch = await user.comparePassword(password);
    } catch (compareErr) {
      console.error("Password comparison error:", compareErr);
      return res.status(500).json({ message: "Server error during authentication" });
    }

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Logged in successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: process.env.NODE_ENV === "development" ? err.message : undefined });
  }
};

// 🔹 Forgot Password - Generate reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a reset token (random 6-digit code for simplicity)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiry

    // Save reset token to user
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // In production, you would send an email here
    // For now, we'll return the code (in production, NEVER send via API response)
    console.log(`[DEV] Reset code for ${email}: ${resetCode}`);

    res.status(200).json({
      message: "Reset code sent to your email (check console in development)",
      // In production: message: "If email exists, a reset link has been sent"
      resetCode: process.env.NODE_ENV === "development" ? resetCode : undefined, // Only in dev
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error", error: process.env.NODE_ENV === "development" ? err.message : undefined });
  }
};

// 🔹 Reset Password - Verify code and set new password
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ message: "Email, reset code, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if reset token exists and is still valid
    if (!user.resetPasswordToken || user.resetPasswordToken !== resetCode) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error", error: process.env.NODE_ENV === "development" ? err.message : undefined });
  }
};
