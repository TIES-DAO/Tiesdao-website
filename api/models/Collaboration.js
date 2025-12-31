import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    points: { type: Number, default: 0 }, // points for leaderboard
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Collaboration", collaborationSchema);
