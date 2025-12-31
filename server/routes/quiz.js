import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ GET ALL ACTIVE QUIZZES
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).select("-questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SINGLE QUIZ WITH QUESTIONS
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ SUBMIT QUIZ ATTEMPT
router.post("/:id/submit", authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.id;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    const answersWithCorrect = answers.map((answer, idx) => ({
      questionId: idx,
      userAnswer: answer,
      isCorrect: quiz.questions[idx]?.correctAnswer === answer,
    }));

    score = answersWithCorrect.filter((a) => a.isCorrect).length;
    const pointsEarned = (score / quiz.questions.length) * quiz.points;

    // Save quiz attempt
    const attempt = new QuizAttempt({
      userId,
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      pointsEarned,
      answers: answersWithCorrect,
    });

    await attempt.save();

    // Update user points
    const user = await User.findById(userId);
    user.quizPoints += pointsEarned;
    user.totalPoints = user.quizPoints + user.referralPoints;
    user.quizzesCompleted += 1;
    await user.save();

    res.json({
      success: true,
      score,
      totalQuestions: quiz.questions.length,
      pointsEarned,
      message: `You scored ${score}/${quiz.questions.length}!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET QUIZ LEADERBOARD
router.get("/leaderboard/quiz", async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select("username email quizPoints quizzesCompleted")
      .sort({ quizPoints: -1 })
      .limit(100);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET USER QUIZ HISTORY
router.get("/user/history", authMiddleware, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id })
      .populate("quizId", "title category points")
      .sort({ completedAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE QUIZ (SUPER ADMIN ONLY)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can create quizzes" });
    }

    const { title, description, category, points, questions, difficulty } =
      req.body;

    const quiz = new Quiz({
      title,
      description,
      category,
      points,
      questions,
      difficulty,
      createdBy: req.user.id,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE QUIZ (SUPER ADMIN ONLY)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update quizzes" });
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE QUIZ (SUPER ADMIN ONLY)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete quizzes" });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
