import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDashboardSummary,
  getCategoryExpenses,
  getMonthlyExpenses,
  getRecentTransactions,
  getDashboardData,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  getDashboardSummary
);

router.get(
  "/category",
  authMiddleware,
  getCategoryExpenses
);

router.get(
  "/monthly",
  authMiddleware,
  getMonthlyExpenses
);

router.get(
  "/recent",
  authMiddleware,
  getRecentTransactions
);

router.get(
  "/",
  authMiddleware,
  getDashboardData
);

export default router;