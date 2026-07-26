import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  uploadStatement,
  statementUploadMiddleware,
} from "../controllers/statementController.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  statementUploadMiddleware,
  uploadStatement
);

export default router;
