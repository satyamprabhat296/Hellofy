import express from "express";
import Resource from "../models/Resource.js";
import ResourceAccess from "../models/ResourceAccess.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * GET resources for logged-in user
 */
router.get("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const isPremiumUser = req.user.isPremium;

    const query = isPremiumUser
      ? {}
      : {
          $or: [
            { createdBy: userId },
            { sharedWith: userId },
            { isPremium: false },
          ],
        };

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    console.error("Fetch resources error:", error);
    res.status(500).json({ message: "Failed to fetch resources" });
  }
});

/**
 * CREATE resource (ADMIN)
 */
router.post("/", protectRoute, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      url,
      type,
      language,
      isPremium,
      sharedWith,
    } = req.body;

    const resource = await Resource.create({
      title,
      description,
      url,
      type,
      language,
      isPremium: Boolean(isPremium),
      createdBy: req.user._id,
      sharedWith: sharedWith || [],
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error("Create resource error:", error);
    res.status(500).json({ message: "Failed to create resource" });
  }
});

/**
 * 📊 ANALYTICS — WHO UNLOCKED WHAT
 */
router.post("/:id/access", protectRoute, async (req, res) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user._id;

    const alreadyLogged = await ResourceAccess.findOne({
      user: userId,
      resource: resourceId,
    });

    if (!alreadyLogged) {
      await ResourceAccess.create({
        user: userId,
        resource: resourceId,
        isPremium: req.user.isPremium,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resource access log error:", error);
    res.status(500).json({ message: "Failed to track access" });
  }
});

export default router;
