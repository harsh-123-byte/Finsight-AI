import express from "express";

import {
  addTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all transactions
router.get("/", authMiddleware, getTransactions);

// Get single transaction
router.get("/:id", authMiddleware, getTransaction);

// Add transaction
router.post("/", authMiddleware, addTransaction);

// Update transaction
router.put("/:id", authMiddleware, updateTransaction);

// Delete transaction
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;