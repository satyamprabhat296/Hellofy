import express from "express";
import Groq from "groq-sdk";
import User from "../models/User.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Initialize Groq with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ AI Recommendation Route
router.get("/recommend", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id; // from protectRoute middleware
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all potential users (excluding self)
    const allUsers = await User.find({ _id: { $ne: userId } });

    if (!allUsers.length) {
      return res.status(400).json({ message: "No other users available for recommendations" });
    }

    // Prepare user data for AI input
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
Given a current user's profile and a list of other developers, suggest 3–5 who would be the best match for pair programming.

Focus on:
- Matching "teaches" languages of one with "learns" of the other
- Similar or complementary "techStack"
- Similar interests in bio

Current user:
${JSON.stringify({
  name: currentUser.fullName,
  teaches: currentUser.languagesToTeach || [],
  learns: currentUser.languagesToLearn || [],
  techStack: currentUser.techStack || [],
  bio: currentUser.bio || "",
}, null, 2)}

Available users:
${JSON.stringify(formattedUsers, null, 2)}

Return ONLY a valid JSON array of user IDs (no explanation, no formatting).
Example output: ["657f22f...", "658f33a...", "6590c44..."]
`;

    // ✅ Use supported Groq model
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ new supported model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    let recommendedIds = [];
    try {
      recommendedIds = JSON.parse(content);
    } catch (err) {
      console.error("Groq returned invalid JSON:", content);
      return res.status(500).json({ message: "AI response could not be parsed" });
    }

    // Fetch recommended user details
    const recommendedUsers = await User.find({
      _id: { $in: recommendedIds },
    });

    return res.json(recommendedUsers);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

export default router;
