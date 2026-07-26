import express from "express";

import {
  register,
  login,
  logout,
  getMe,
  updateMe,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.put(
  "/me",
  protect,
  updateMe
);

router.post(
  "/logout",
  logout
);

router.get(
  "/me",
  protect,
  getMe
);

export default router;