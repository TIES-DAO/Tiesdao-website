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
