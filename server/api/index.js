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

// Verify environment variables
console.log("Environment check:");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("NODE_ENV:", process.env.NODE_ENV);

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

// ✅ MongoDB Connection with retry logic
const mongoConnect = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected");
      return true;
    }

    try {
      console.log(`Attempting MongoDB connection (attempt ${i + 1}/${retries})...`);
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      });
      console.log("✅ MongoDB connected successfully");
      return true;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      }
    }
  }
  console.warn("⚠️ MongoDB connection failed after retries");
  return false;
};

// Initialize MongoDB connection immediately
mongoConnect();

// Add connection event listeners
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected from MongoDB");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ Mongoose reconnected to MongoDB");
});

/* Test route */
app.get("/", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  const mongoStatus = mongoConnected ? "✅ Connected" : "⚠️ Disconnected";
  res.json({ 
    message: "TIE DAO API is running 🚀", 
    mongo: mongoStatus,
    readyState: mongoose.connection.readyState
  });
});

/* Health check */
app.get("/health", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  res.status(mongoConnected ? 200 : 503).json({ 
    status: mongoConnected ? "ok" : "degraded",
    mongodb: mongoConnected,
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

/* MongoDB diagnostic endpoint */
app.get("/api/mongo-status", (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      readyStateDescription: states[mongoose.connection.readyState],
      host: mongoose.connection.host || "unknown",
      port: mongoose.connection.port || "unknown",
      db: mongoose.connection.db?.databaseName || "unknown"
    },
    env: {
      mongoUriExists: !!process.env.MONGO_URI,
      mongoUriPrefix: process.env.MONGO_URI?.substring(0, 20) + "..."
    }
  });
});

/* Routes */
app.use("/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/daily-streak", dailyStreakRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/admin", adminRoutes);

/* 404 handler */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* Global error handler */
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
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
