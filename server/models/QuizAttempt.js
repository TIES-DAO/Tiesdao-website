import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    pointsEarned: { type: Number, required: true },
    answers: [
      {
        questionId: Number,
        userAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export default mongoose.model("QuizAttempt", quizAttemptSchema);
