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

// ✅ MongoDB Connection - establish before starting server
const mongoConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Don't throw - allow server to start but with warnings
  }
};

// Connect to MongoDB
mongoConnect();

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
  const mongoStatus = mongoose.connection.readyState === 1 ? "✅ Connected" : "⚠️ Connecting";
  res.json({ message: "TIE DAO API is running 🚀", mongo: mongoStatus });
});

/* Health check */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", mongodb: mongoose.connection.readyState === 1 });
});

/* Routes */
app.use("/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/daily-streak", dailyStreakRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/admin", adminRoutes);

/* Global error handler */
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({ 
    message: err.message || "Server error",
    error: process.env.NODE_ENV === "development" ? err : undefined
  });
});

/* Start server (for local development) */
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

/* Export for Vercel */
export default app;
