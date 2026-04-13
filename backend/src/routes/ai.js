import express from "express";
import Groq from "groq-sdk";
import User from "../models/User.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ AI Recommendation Route
router.get("/recommend", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allUsers = await User.find({ _id: { $ne: userId } });

    if (!allUsers.length) {
      return res.status(400).json({
        message: "No users available for recommendation",
      });
    }

    const formattedUsers = allUsers.map((u) => ({
      id: u._id,
      name: u.fullName,
      teaches: u.languagesToTeach || [],
      learns: u.languagesToLearn || [],
      techStack: u.techStack || [],
      bio: u.bio || "",
    }));

    const prompt = `
You are an expert developer matchmaker AI.

Suggest 3–5 best matches for pair programming.

Rules:
- Match "teaches" with "learns"
- Match techStack similarity
- Consider bio similarity

Return ONLY JSON array of user IDs.

Current user:
${JSON.stringify({
  name: currentUser.fullName,
  teaches: currentUser.languagesToTeach || [],
  learns: currentUser.languagesToLearn || [],
  techStack: currentUser.techStack || [],
  bio: currentUser.bio || "",
}, null, 2)}

Users:
${JSON.stringify(formattedUsers, null, 2)}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    let recommendedIds = [];

    try {
      recommendedIds = JSON.parse(content);
    } catch (err) {
      console.error("Invalid JSON from AI:", content);
      return res.status(500).json({
        message: "AI response parsing failed",
      });
    }

    const recommendedUsers = await User.find({
      _id: { $in: recommendedIds },
    });

    res.json(recommendedUsers);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

export default router;