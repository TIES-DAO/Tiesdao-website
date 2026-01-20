import express from "express";
import DailyStreak from "../models/DailyStreak.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper function to check if two dates are consecutive
const isConsecutiveDay = (lastCheckin, today) => {
  if (!lastCheckin) return false;
  
  const lastDate = new Date(lastCheckin);
  const todayDate = new Date(today);
  
  // Calculate difference in days
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};

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
      // First time check-in
      streak = await DailyStreak.create({
        user_id: userId,
        streak: 1,
        last_checkin: today,
      });
    } else {
      // Already checked in today
      if (streak.last_checkin === today) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      // Check if the last check-in was yesterday (consecutive day)
      if (isConsecutiveDay(streak.last_checkin, today)) {
        // Consecutive day - increment streak
        streak.streak = streak.streak + 1;
      } else {
        // Missed a day - reset streak to 1
        streak.streak = 1;
      }
      
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
