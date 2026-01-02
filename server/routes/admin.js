import express from "express";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

// ✅ ADMIN PASSWORD (HARDCODED - Change this!)
const ADMIN_PASSWORD = "TIE_DAO_ADMIN_2025";

// ✅ VERIFY ADMIN PASSWORD
router.post("/verify-password", async (req, res) => {
  try {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
      // Create a temporary token or session
      res.json({
        success: true,
        token: Buffer.from(ADMIN_PASSWORD).toString("base64"),
      });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ MIDDLEWARE TO CHECK ADMIN PASSWORD
const verifyAdminPassword = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === Buffer.from(ADMIN_PASSWORD).toString("base64")) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// ✅ GET ALL USERS
router.get("/users", verifyAdminPassword, async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "username email quizPoints referralPoints totalPoints quizzesCompleted createdAt"
      )
      .sort({ totalPoints: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE USER
router.delete("/users/:userId", verifyAdminPassword, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Also delete user's quiz attempts
    await QuizAttempt.deleteMany({ userId: req.params.userId });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET USER DETAILS WITH ALL POINTS
router.get("/users/:userId", verifyAdminPassword, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const quizAttempts = await QuizAttempt.find({
      userId: req.params.userId,
    }).populate("quizId", "title category");

    res.json({
      user,
      quizAttempts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE QUIZ (ADMIN ONLY)
router.post("/quizzes", verifyAdminPassword, async (req, res) => {
  try {
    const { title, description, category, points, questions, difficulty } =
      req.body;

    const quiz = new Quiz({
      title,
      description,
      category,
      points,
      questions,
      difficulty,
      createdBy: null, // Explicitly set to null
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error("Quiz creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL QUIZZES
router.get("/quizzes", verifyAdminPassword, async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE QUIZ
router.put("/quizzes/:quizId", verifyAdminPassword, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
      new: true,
    });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE QUIZ
router.delete("/quizzes/:quizId", verifyAdminPassword, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.quizId);
    // Also delete all quiz attempts
    await QuizAttempt.deleteMany({ quizId: req.params.quizId });

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET DASHBOARD STATS
router.get("/stats", verifyAdminPassword, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await QuizAttempt.countDocuments();

    const topUsers = await User.find()
      .select("username email totalPoints quizPoints referralPoints")
      .sort({ totalPoints: -1 })
      .limit(10);

    // User growth chart: users registered per day for the last 14 days
    const days = 14;
    const today = new Date();
    const chart = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date(today);
      day.setHours(0, 0, 0, 0);
      day.setDate(today.getDate() - i);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      // Count users created on this day
      const value = await User.countDocuments({
        createdAt: { $gte: day, $lt: nextDay },
      });
      chart.push({ date: day.toISOString().slice(0, 10), value });
    }

    res.json({
      totalUsers,
      totalQuizzes,
      totalAttempts,
      topUsers,
      chart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
