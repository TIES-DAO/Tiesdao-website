import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import crypto from "crypto";

const router = express.Router();

// ✅ GENERATE REFERRAL CODE
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.referralCode) {
      return res.json({ referralCode: user.referralCode });
    }

    // Generate unique referral code
    const referralCode = crypto.randomBytes(6).toString("hex").toUpperCase();
    user.referralCode = referralCode;
    await user.save();

    res.json({ referralCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET USER REFERRAL INFO
router.get("/info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email referralCode referralPoints referredBy"
    );

    // Count users who were referred using this code
    const referralCount = await User.countDocuments({
      referredBy: user.referralCode,
    });

    // If actual count is 0 but user has points, calculate based on points
    const calculatedCount = referralCount || Math.floor((user.referralPoints || 0) / 100);

    // Get list of referred users
    const referredUsers = await User.find({
      referredBy: user.referralCode,
    }).select("email username totalPoints quizzesCompleted createdAt");

    // Add activity status
    const referredUsersWithStatus = referredUsers.map(user => ({
      email: user.email,
      username: user.username,
      totalPoints: user.totalPoints,
      quizzesCompleted: user.quizzesCompleted,
      joinedAt: user.createdAt,
      isActive: user.totalPoints > 0 || user.quizzesCompleted > 0,
    }));

    // Get referrer info if user was referred
    let referrerInfo = null;
    if (user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy }).select("username email");
      if (referrer) {
        referrerInfo = {
          username: referrer.username,
          email: referrer.email,
        };
      }
    }

    res.json({
      referralCode: user.referralCode,
      referralPoints: user.referralPoints,
      referralCount: calculatedCount,
      referredUsers: referredUsersWithStatus,
      referrer: referrerInfo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET REFERRAL LEADERBOARD
router.get("/leaderboard/referral", async (req, res) => {
  try {
    const users = await User.find({ referralCode: { $exists: true, $ne: null } })
      .select("username email referralPoints referralCode _id")
      .sort({ referralPoints: -1 })
      .limit(100);

    // Count referrals for each user
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const referralsCount = await User.countDocuments({
          referredBy: user.referralCode,
        });
        
        // If actual referral count is 0 but user has referral points,
        // calculate based on points (100 points = 1 referral)
        const calculatedCount = referralsCount || Math.floor((user.referralPoints || 0) / 100);
        
        return {
          ...user.toObject(),
          referralsCount: calculatedCount,
        };
      })
    );

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ APPLY REFERRAL CODE (for new users)
router.post("/apply/:referralCode", authMiddleware, async (req, res) => {
  try {
    const { referralCode } = req.params;
    const userId = req.user.id;

    // Find referrer
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ error: "Invalid referral code" });
    }

    // Award points to referrer (100 points per referral)
    referrer.referralPoints += 100;
    referrer.totalPoints = referrer.quizPoints + referrer.referralPoints;
    await referrer.save();

    // Save referral code on new user so we can track who referred them
    const newUser = await User.findById(userId);
    newUser.referredBy = referralCode;
    newUser.referralPoints += 50;
    newUser.totalPoints = newUser.quizPoints + newUser.referralPoints;
    await newUser.save();

    res.json({
      message: "Referral applied successfully!",
      bonusPoints: 50,
      referrerReward: 100,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
