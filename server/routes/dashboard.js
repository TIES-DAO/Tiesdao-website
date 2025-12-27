import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import DailyStreak from "../models/DailyStreak.js";
import Reward from "../models/Reward.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // -------------------------
    // CURRENT USER
    const user = await User.findById(userId).select("email username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // -------------------------
    // CURRENT USER STREAK
    const userStreak = await DailyStreak.findOne({ user_id: userId });

    // -------------------------
    // 🔥 LEADERBOARD (HIGHEST → LOWEST STREAK)
    const leaderboard = await DailyStreak.find()
      .sort({ streak: -1 }) // highest first
      .limit(20)
      .populate("user_id", "username");

    const topStreakUsers = leaderboard.map((entry) => ({
      username: entry.user_id?.username || "Unknown",
      streak: entry.streak,
    }));

    // -------------------------
    // REWARDS (OPTIONAL)
    const rewards = await Reward.find({ available: true });

    // -------------------------
    // RESPONSE
    res.json({
      user: {
        email: user.email,
        username: user.username,
      },
      streak: userStreak?.streak || 0,
      last_checkin: userStreak?.last_checkin || null,
      top_streak_users: topStreakUsers, // ✅ ONLY LEADERBOARD
      rewards: rewards.map((r) => ({
        title: r.title,
        description: r.description,
      })),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
});

export default router;
