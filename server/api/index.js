import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "../routes/contact.js";
import feedbackRoutes from "../routes/feedback.js";
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

/* Middleware to ensure MongoDB connection on each request */
app.use(async (req, res, next) => {
  try {
    await ensureMongoConnection();
    next();
  } catch (err) {
    console.error("Connection middleware error:", err);
    next();
  }
});

// ✅ MongoDB Connection with lazy initialization (serverless-friendly)
let mongoConnected = false;

const mongoConnect = async (retries = 3) => {
  // Skip if already connected
  if (mongoose.connection.readyState === 1 || mongoConnected) {
    return true;
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[${new Date().toISOString()}] MongoDB connection attempt ${i + 1}/${retries}...`);
      
      await mongoose.connect(process.env.MONGO_URI, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 5,
        minPoolSize: 1,
        retryWrites: true,
      });
      
      mongoConnected = true;
      console.log(`[${new Date().toISOString()}] ✅ MongoDB connected successfully`);
      return true;
    } catch (err) {
      console.error(`[${new Date().toISOString()}] ❌ Connection attempt ${i + 1} failed:`, err.message);
      
      if (i < retries - 1) {
        const waitTime = 2000 * (i + 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.warn(`[${new Date().toISOString()}] ⚠️ MongoDB connection failed after all retries`);
  return false;
};

// For serverless: connect on first request, not at startup
let connectionAttempted = false;

const ensureMongoConnection = async () => {
  if (!connectionAttempted) {
    connectionAttempted = true;
    await mongoConnect();
  } else if (mongoose.connection.readyState !== 1) {
    // If previously attempted but disconnected, try to reconnect
    await mongoConnect(1);
  }
};

// Add connection event listeners
mongoose.connection.on("connected", () => {
  mongoConnected = true;
  console.log(`[${new Date().toISOString()}] ✅ Mongoose connected to MongoDB`);
});

mongoose.connection.on("error", (err) => {
  mongoConnected = false;
  console.error(`[${new Date().toISOString()}] ❌ Mongoose error:`, err.message);
});

mongoose.connection.on("disconnected", () => {
  mongoConnected = false;
  console.warn(`[${new Date().toISOString()}] ⚠️ Mongoose disconnected`);
});

mongoose.connection.on("reconnected", () => {
  mongoConnected = true;
  console.log(`[${new Date().toISOString()}] ✅ Mongoose reconnected`);
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

/* Manual MongoDB reconnection endpoint */
app.post("/api/mongo-reconnect", async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Manual reconnection triggered`);
    
    if (mongoose.connection.readyState === 1) {
      return res.json({ 
        message: "Already connected", 
        connected: true,
        readyState: 1
      });
    }

    // Force disconnect and reconnect
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    connectionAttempted = false;
    const result = await mongoConnect(3);
    
    res.json({ 
      message: result ? "Connected successfully" : "Connection failed",
      connected: result,
      readyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
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
app.use("/feedback", feedbackRoutes);
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
