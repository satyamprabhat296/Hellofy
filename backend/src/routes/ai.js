import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAIRecommendations } from "../controllers/aiController.js";

const router = express.Router();

router.get("/recommend", protectRoute, getAIRecommendations);

export default router;