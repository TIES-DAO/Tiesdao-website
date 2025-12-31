import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    points: { type: Number, required: true, default: 10 },
    questions: [
      {
        question: { type: String, required: true },
        options: [String],
        correctAnswer: { type: Number, required: true },
        explanation: String,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // super admin who created it
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
