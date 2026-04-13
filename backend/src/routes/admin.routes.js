import express from "express";
import User from "../models/User.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * GET all users
 */
router.get("/users", protectRoute, requireAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/**
 * TOGGLE premium
 */
router.patch(
  "/users/:id/premium",
  protectRoute,
  requireAdmin,
  async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isPremium = !user.isPremium;
    user.premiumSince = user.isPremium ? new Date() : null;

    await user.save();
    res.json(user);
  }
);

/**
 * PROMOTE to admin
 */
router.patch(
  "/users/:id/admin",
  protectRoute,
  requireAdmin,
  async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = true;
    await user.save();

    res.json({ message: "User promoted to admin" });
  }
);

export default router;
