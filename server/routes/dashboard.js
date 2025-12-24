import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import DailyStreak from "../models/DailyStreak.js";
import Collaboration from "../models/Collaboration.js";
import Reward from "../models/Reward.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    const streak = await DailyStreak.findOne({ user_id: userId });
    const topCollaborations = await Collaboration.find().sort({ points: -1 }).limit(5);
    const rewards = await Reward.find({ available: true });

    res.json({
      user: { email: user.email, username: user.username },
      streak: streak?.streak || 0,
      last_checkin: streak?.last_checkin || null,
      collaborations: topCollaborations.map(c => ({ username: c.user_id, points: c.points })),
      rewards: rewards.map(r => ({ title: r.title, description: r.description })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
});

export default router;
