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

// ✅ GET QUIZ ANALYTICS
router.get("/analytics/quizzes", verifyAdminPassword, async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    const analytics = await Promise.all(
      quizzes.map(async (quiz) => {
        const attempts = await QuizAttempt.find({ quizId: quiz._id });
        const avgScore = attempts.length > 0
          ? (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(2)
          : 0;
        const totalAttempts = attempts.length;
        const questionStats = quiz.questions.map((q, idx) => {
          const correctCount = attempts.filter(a => a.answers[idx]?.isCorrect).length;
          return {
            questionId: idx,
            question: q.question,
            correctCount,
            correctPercentage: attempts.length > 0 ? ((correctCount / attempts.length) * 100).toFixed(2) : 0,
          };
        });
        return {
          _id: quiz._id,
          title: quiz.title,
          category: quiz.category,
          totalAttempts,
          avgScore,
          questionStats,
        };
      })
    );
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET USER ANALYTICS (detailed user info with referral chain)
router.get("/analytics/users/:userId", verifyAdminPassword, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const quizAttempts = await QuizAttempt.find({ userId: req.params.userId })
      .populate("quizId", "title category points");
    
    // Get referral chain
    const referredUsers = await User.find({ referredBy: user.referralCode });
    const referrer = user.referredBy ? await User.findOne({ referralCode: user.referredBy }) : null;

    res.json({
      user,
      quizAttempts,
      referralStats: {
        referredCount: referredUsers.length,
        referredBy: referrer ? referrer.username : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DUPLICATE QUIZ
router.post("/quizzes/:quizId/duplicate", verifyAdminPassword, async (req, res) => {
  try {
    const originalQuiz = await Quiz.findById(req.params.quizId);
    if (!originalQuiz) return res.status(404).json({ error: "Quiz not found" });

    const newQuiz = new Quiz({
      title: `${originalQuiz.title} (Copy)`,
      description: originalQuiz.description,
      category: originalQuiz.category,
      points: originalQuiz.points,
      difficulty: originalQuiz.difficulty,
      questions: originalQuiz.questions,
      createdBy: null,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ BAN/SUSPEND USER
router.patch("/users/:userId/suspend", verifyAdminPassword, async (req, res) => {
  try {
    const { suspended } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { suspended },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: `User ${suspended ? "suspended" : "unsuspended"}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ RESET USER POINTS
router.patch("/users/:userId/reset-points", verifyAdminPassword, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { quizPoints: 0, referralPoints: 0, totalPoints: 0 },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Points reset", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADJUST USER POINTS
router.patch("/users/:userId/adjust-points", verifyAdminPassword, async (req, res) => {
  try {
    const { amount, type } = req.body; // type: 'quiz' or 'referral'
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (type === "quiz") {
      user.quizPoints += amount;
    } else if (type === "referral") {
      user.referralPoints += amount;
    }
    user.totalPoints = user.quizPoints + user.referralPoints;
    await user.save();

    res.json({ message: `${amount > 0 ? "Added" : "Deducted"} ${Math.abs(amount)} points`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ VERIFY REFERRAL INTEGRITY
router.get("/verify/referrals", verifyAdminPassword, async (req, res) => {
  try {
    const users = await User.find();
    const issues = [];

    for (const user of users) {
      if (user.referredBy) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (!referrer) {
          issues.push({
            userId: user._id,
            username: user.username,
            issue: "Referrer not found",
            referralCode: user.referredBy,
          });
        }
      }
    }

    res.json({ totalUsers: users.length, issues: issues.length, issues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ EXPORT USERS TO JSON
router.get("/export/users", verifyAdminPassword, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ EXPORT QUIZ ATTEMPTS TO JSON
router.get("/export/attempts", verifyAdminPassword, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find()
      .populate("userId", "username email")
      .populate("quizId", "title category");
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET AUDIT LOG (Admin Actions)
router.get("/audit-log", verifyAdminPassword, async (req, res) => {
  try {
    // This would normally be stored in a separate collection
    // For now, return recent changes based on updatedAt timestamps
    const recentUsers = await User.find().sort({ updatedAt: -1 }).limit(50);
    const recentQuizzes = await Quiz.find().sort({ updatedAt: -1 }).limit(50);
    
    res.json({
      recentUsers,
      recentQuizzes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
