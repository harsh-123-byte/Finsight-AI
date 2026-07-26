import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import statementRoutes from "./routes/statementRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";

dotenv.config();

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ===============================
// API Routes
// ===============================

// Authentication
app.use("/api/auth", authRoutes);

// Transactions
app.use("/api/transactions", transactionRoutes);

// Statement Upload
app.use("/api/statement", statementRoutes);

// AI Insights
app.use("/api/ai", aiRoutes);

// Debug routes
app.use("/api/debug", debugRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// ===============================
// Health Check Route
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 FinSight AI Backend Running",
  });
});

// ===============================
// 404 Route
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;