import axios from "axios";
import User from "../models/User.js";

export const getAIRecommendations = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured.",
      });
    }

    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const allUsers = await User.find({
      _id: { $ne: currentUser._id },
    });

    if (allUsers.length === 0) {
      return res.status(200).json({
        success: true,
        recommendations: [],
      });
    }

    const usersForAI = allUsers.map((user) => ({
      id: String(user._id),
      name: user.fullName || "Unknown",
      teaches: user.languagesToTeach || [],
      learns: user.languagesToLearn || [],
      techStack: user.techStack || [],
      bio: user.bio || "",
    }));

    const prompt = `
Recommend up to 3 coding partners for the current user.

Prioritize complementary teaching and learning interests:
- Match languages the current user teaches with languages others want to learn.
- Match languages the current user wants to learn with languages others teach.
- Consider tech stacks and bios.
- Only return IDs from the available users.
- Never recommend the current user or invent IDs.

Current user:
${JSON.stringify(
  {
    teaches: currentUser.languagesToTeach || [],
    learns: currentUser.languagesToLearn || [],
    techStack: currentUser.techStack || [],
    bio: currentUser.bio || "",
  },
  null,
  2
)}

Available users:
${JSON.stringify(usersForAI, null, 2)}

Return ONLY a valid JSON array of user ID strings.
Example: ["id1", "id2", "id3"]
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content:
              "You recommend coding partners. Return only a valid JSON array of IDs provided in the prompt.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const aiText =
      response.data.choices?.[0]?.message?.content?.trim() || "[]";

    const cleanText = aiText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsedIds;

    try {
      parsedIds = JSON.parse(cleanText);
    } catch {
      console.error("Invalid JSON returned by Groq:", aiText);

      return res.status(502).json({
        success: false,
        message: "AI returned an invalid recommendation format.",
      });
    }

    if (
      !Array.isArray(parsedIds) ||
      !parsedIds.every((id) => typeof id === "string")
    ) {
      return res.status(502).json({
        success: false,
        message: "AI returned an invalid recommendation list.",
      });
    }

    const usersById = new Map(
      allUsers.map((user) => [String(user._id), user])
    );

    const uniqueIds = [
      ...new Set(
        parsedIds.filter((id) => usersById.has(id))
      ),
    ].slice(0, 3);

    const recommendations = uniqueIds.map((id) =>
      usersById.get(id)
    );

    return res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", {
      message: error.message,
      status: error.response?.status || error.status,
      details: error.response?.data,
    });

    const status = error.response?.status;

    if (status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI rate limit reached. Please try again shortly.",
      });
    }

    return res.status(502).json({
      success: false,
      message: "AI recommendations are temporarily unavailable.",
    });
  }
};