import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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

    // Send email with reset code
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"TIE DAO" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔐 Password Reset Code - TIE DAO",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px;">
            <div style="background: white; border-radius: 8px; padding: 40px; text-align: center;">
              <h1 style="color: #333; margin: 0 0 20px; font-size: 28px;">🔐 Password Reset</h1>
              
              <p style="color: #666; font-size: 16px; margin: 20px 0;">
                We received a request to reset your password. Use the code below to create a new password:
              </p>
              
              <div style="background: #f5f5f5; border: 2px dashed #667eea; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="color: #999; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 2px;">Your Reset Code</p>
                <h2 style="color: #667eea; font-size: 48px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">
                  ${resetCode}
                </h2>
              </div>
              
              <p style="color: #999; font-size: 14px; margin: 20px 0;">
                ⏱️ This code will expire in <strong>1 hour</strong>
              </p>
              
              <p style="color: #666; font-size: 14px; margin: 20px 0;">
                Enter this code on the password reset page to create a new password.
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #667eea; border-radius: 4px;">
                <p style="color: #666; font-size: 13px; margin: 0;">
                  <strong>⚠️ Security Tip:</strong> Never share this code with anyone. TIE DAO staff will never ask for your reset code.
                </p>
              </div>
              
              <p style="color: #999; font-size: 12px; margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #eee;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
              
              <p style="color: #999; font-size: 11px; margin: 10px 0 0;">
                © 2026 TIE DAO. All rights reserved.
              </p>
            </div>
          </div>
        `,
        text: `Password Reset Code for TIE DAO\n\nYour reset code is: ${resetCode}\n\nThis code will expire in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`,
      });

      console.log(`✅ Reset code email sent to ${email}`);
    } catch (emailErr) {
      console.error("❌ Email send error:", emailErr);
      // Still allow reset code generation even if email fails
      // Log the code to console as fallback
      console.log(`[FALLBACK] Reset code for ${email}: ${resetCode}`);
    }

    res.status(200).json({
      message: "Reset code sent to your email! Check your inbox.",
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
