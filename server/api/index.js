import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "../routes/contact.js";
import authRoutes from "../routes/auth.js"; // 🔹 new
import dailyStreakRoutes from "../routes/dailyStreak.js";
import dashboardRoutes from "../routes/dashboard.js";

dotenv.config();

const app = express();

/* Middlewares */
app.use(cors({ origin: "https://tiesdao.vercel.app", credentials: true }));
app.use(express.json());

/* Test route */
app.get("/", (req, res) => {
  res.json({ message: "TIE DAO API is running 🚀" });
});

/* Routes */
app.use("/contact", contactRoutes);
app.use("/api/auth", authRoutes); // 🔹 auth routes

app.use("/api/daily-streak", dailyStreakRoutes);
app.use("/api/dashboard", dashboardRoutes);


/* MongoDB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

/* Start server */
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
