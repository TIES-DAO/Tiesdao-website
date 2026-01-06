import express from "express";
import DailyStreak from "../models/DailyStreak.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET streak
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await DailyStreak.findOne({ user_id: userId });
    res.json(streak || { streak: 0, last_checkin: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch streak" });
  }
});

// POST check-in
router.post("/checkin", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = req.body.date || new Date().toISOString().split("T")[0];

    let streak = await DailyStreak.findOne({ user_id: userId });

    if (!streak) {
      streak = await DailyStreak.create({
        user_id: userId,
        streak: 1,
        last_checkin: today,
      });
    } else {
      if (streak.last_checkin === today) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      streak.streak = streak.streak + 1;
      streak.last_checkin = today;
      await streak.save();
    }

    res.json(streak);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Check-in failed" });
  }
});

export default router;
