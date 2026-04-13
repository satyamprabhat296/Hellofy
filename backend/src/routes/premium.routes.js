import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requirePremium } from "../middleware/premium.middleware.js";

const router = express.Router();

/**
 * 🔒 Premium-only API
 * GET /api/premium/hello
 */
router.get(
  "/hello",
  protectRoute,    // 1️⃣ user must be logged in
  requirePremium,  // 2️⃣ user must be premium
  async (req, res) => {
    res.json({
      message: `Welcome Premium User ${req.user.fullName} 👑`,
    });
  }
);

export default router;
