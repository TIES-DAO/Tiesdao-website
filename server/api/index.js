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
      console.log("MONGO_URI:", process.env.MONGO_URI?.substring(0, 50) + "...");
      
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 15000,
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
      console.log("✅ MongoDB connected successfully");
      return true;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, {
        message: err.message,
        code: err.code,
        name: err.name
      });
      
      if (i < retries - 1) {
        const waitTime = 3000 * (i + 1);
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  console.warn("⚠️ MongoDB connection failed after all retries");
  return false;
};

// Initialize MongoDB connection immediately with better error handling
(async () => {
  try {
    await mongoConnect();
  } catch (err) {
    console.error("Fatal error during MongoDB initialization:", err);
  }
})();

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

// Auto-reconnection logic - try to reconnect every 30 seconds if disconnected
setInterval(async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log("⏰ Attempting auto-reconnect...");
    try {
      await mongoConnect(1);
    } catch (err) {
      console.error("Auto-reconnect failed:", err.message);
    }
  }
}, 30000);

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

/* Manual MongoDB reconnection endpoint */
app.post("/api/mongo-reconnect", async (req, res) => {
  try {
    console.log("Manual reconnection attempt triggered");
    
    if (mongoose.connection.readyState === 1) {
      return res.json({ message: "Already connected", connected: true });
    }

    const result = await mongoConnect(3);
    res.json({ 
      message: result ? "Connected successfully" : "Connection failed",
      connected: result,
      readyState: mongoose.connection.readyState
    });
  } catch (err) {
    console.error("Reconnection error:", err);
    res.status(500).json({ 
      error: err.message,
      readyState: mongoose.connection.readyState
    });
  }
});

/* MongoDB URI validation endpoint */
app.get("/api/mongo-validate", (req, res) => {
  const uri = process.env.MONGO_URI;
  
  if (!uri) {
    return res.status(400).json({ error: "MONGO_URI not set" });
  }

  try {
    // Parse basic URI structure
    const uriMatch = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)\/?(.*)$/);
    
    if (!uriMatch) {
      return res.json({
        valid: false,
        error: "Invalid MongoDB URI format",
        expected: "mongodb+srv://username:password@cluster.mongodb.net/database"
      });
    }

    const [, username, password, cluster, dbParams] = uriMatch;
    
    res.json({
      valid: true,
      parsed: {
        username: username ? "****" : "missing",
        password: password ? "****" : "missing",
        cluster: cluster,
        hasDatabase: !!dbParams
      },
      tip: "Ensure MongoDB Atlas allows connections from your IP (0.0.0.0/0 or Vercel IPs)"
    });
  } catch (err) {
    res.status(400).json({ 
      error: "Failed to parse URI",
      message: err.message
    });
  }
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
