import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import DailyStreak from "../models/DailyStreak.js";
import Reward from "../models/Reward.js";

const router = express.Router();

// -------------------------
// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // CURRENT USER
    const user = await User.findById(userId).select("email username");
    if (!user) return res.status(404).json({ message: "User not found" });

    // CURRENT USER STREAK
    const userStreak = await DailyStreak.findOne({ user_id: userId });
    const currentStreak = userStreak?.streak || 0;

    // USER'S RANK (count users with higher streak + 1)
    const usersWithHigherStreak = await DailyStreak.countDocuments({
      streak: { $gt: currentStreak }
    });
    const userRank = usersWithHigherStreak + 1;

    // TOTAL USERS WITH STREAKS
    const totalStreakUsers = await DailyStreak.countDocuments({ streak: { $gt: 0 } });

    // 🔥 LEADERBOARD (Highest → Lowest streak)
    const leaderboard = await DailyStreak.find()
      .sort({ streak: -1 })
      .limit(100)
      .populate("user_id", "username");

    const topStreakUsers = leaderboard.map((entry) => ({
      username: entry.user_id?.username || "Unknown",
      streak: entry.streak,
    }));

    // AVAILABLE REWARDS
    const rewards = await Reward.find({ available: true });

    // RESPONSE
    res.json({
      user: {
        email: user.email,
        username: user.username,
      },
      streak: currentStreak,
      last_checkin: userStreak?.last_checkin || null,
      user_rank: userRank,
      total_streak_users: totalStreakUsers,
      top_streak_users: topStreakUsers,
      rewards: rewards.map((r) => ({
        id: r._id,
        title: r.title,
        description: r.description,
        available: r.available,
      })),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard" });
  }
});

// -------------------------
// POST /api/rewards/claim
router.post("/rewards/claim", authMiddleware, async (req, res) => {
  const { rewardId, usdtWallet, bnbWallet } = req.body;

  if (!usdtWallet || !bnbWallet) {
    return res.status(400).json({ error: "USDT and BNB wallets are required" });
  }

  try {
    const reward = await Reward.findById(rewardId);
    if (!reward) return res.status(404).json({ error: "Reward not found" });
    if (reward.user_id) return res.status(400).json({ error: "Reward already claimed" });

    // Assign reward to user
    reward.user_id = req.user.id;
    reward.available = false; // mark as claimed
    reward.usdtWallet = usdtWallet;
    reward.bnbWallet = bnbWallet;

    await reward.save();

    res.json({ message: "Reward claimed successfully!", reward });
  } catch (err) {
    console.error("Reward claim error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
