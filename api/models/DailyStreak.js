import mongoose from "mongoose";

const dailyStreakSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    streak: { type: Number, default: 0 },
    last_checkin: { type: String, default: null }, // store YYYY-MM-DD
  },
  { timestamps: true }
);

export default mongoose.model("DailyStreak", dailyStreakSchema);
