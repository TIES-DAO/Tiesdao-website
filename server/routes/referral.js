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
      "username email referralCode referralPoints"
    );

    // Count users who were referred using this code (exclude the owner)
    const referralCount = await User.countDocuments({ 
      referralCode: user.referralCode,
      _id: { $ne: req.user.id } 
    });

    res.json({
      referralCode: user.referralCode,
      referralPoints: user.referralPoints,
      referralCount: referralCount,
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
        return {
          ...user.toObject(),
          referralsCount,
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

    // Optionally give the new user a bonus (50 points)
    const newUser = await User.findById(userId);
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
