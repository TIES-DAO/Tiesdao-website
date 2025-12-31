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
    const today = new Date().toISOString().split("T")[0];

    let streak = await DailyStreak.findOne({ user_id: userId });
    let newStreak = 1;

    if (!streak) {
      streak = await DailyStreak.create({
        user_id: userId,
        streak: 1,
        last_checkin: today,
      });
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yestStr = yesterday.toISOString().split("T")[0];

      if (streak.last_checkin === today) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      if (streak.last_checkin === yestStr) newStreak = streak.streak + 1;

      streak.streak = newStreak;
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
