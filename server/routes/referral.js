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
      referralCount,
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
    const [users, referralCounts] = await Promise.all([
      User.find({ referralCode: { $exists: true, $ne: null } })
        .select("username email referralPoints referralCode _id")
        .sort({ referralPoints: -1 })
        .limit(10),
      User.aggregate([
        { $match: { referredBy: { $ne: null } } },
        { $group: { _id: "$referredBy", count: { $sum: 1 } } },
      ]),
    ]);

    const countsByReferralCode = new Map(
      referralCounts.map((entry) => [entry._id, entry.count])
    );

    const leaderboard = users.map((user) => ({
      ...user.toObject(),
      referralsCount: countsByReferralCode.get(user.referralCode) || 0,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
