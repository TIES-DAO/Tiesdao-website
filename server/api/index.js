import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "../routes/contact.js";
import authRoutes from "../routes/auth.js";
import dailyStreakRoutes from "../routes/dailyStreak.js";
import dashboardRoutes from "../routes/dashboard.js";
import quizRoutes from "../routes/quiz.js";
import referralRoutes from "../routes/referral.js";
import adminRoutes from "../routes/admin.js";

dotenv.config();

const app = express();

/* Middlewares */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL || "https://tiesdao.vercel.app",
];

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));
app.use(express.json());

/* Test route */
app.get("/", (req, res) => {
  res.json({ message: "TIE DAO API is running 🚀" });
});

/* Routes */
app.use("/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/daily-streak", dailyStreakRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/admin", adminRoutes);


/* MongoDB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

/* Start server (for local development) */
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

/* Export for Vercel */
export default app;
