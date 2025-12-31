import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    available: { type: Boolean, default: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if reward claimed
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);
