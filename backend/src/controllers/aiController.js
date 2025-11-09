import axios from "axios";

export const getAIRecommendations = async (req, res) => {
  try {
    const { currentUser, allUsers } = req.body;

    if (!currentUser || !allUsers) {
      return res.status(400).json({ message: "Missing data for AI recommendations" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192", // Groq's top free model
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that recommends coding partners based on mutual learning and teaching interests.",
          },
          {
            role: "user",
            content: `
We need to match ${currentUser.fullName || "this user"} with 3 users who best align their "languagesToTeach" and "languagesToLearn".

Current User:
${JSON.stringify({
  teaches: currentUser.languagesToTeach || [],
  learns: currentUser.languagesToLearn || [],
  techStack: currentUser.techStack || [],
})}

Available Users:
${JSON.stringify(
  allUsers.map((u) => ({
    id: u._id,
    name: u.fullName,
    teaches: u.languagesToTeach,
    learns: u.languagesToLearn,
    techStack: u.techStack,
  })),
  null,
  2
)}

Respond **only** with a valid JSON array of 3 user IDs, e.g.:
["65a2b...", "65a3f...", "65a4c..."]
`,
          },
        ],
        temperature: 0.6,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content?.trim() || "[]";

    // 🧹 Clean any formatting like ```json blocks
    const cleanText = aiText.replace(/```json|```/g, "").trim();
    const parsedIds = JSON.parse(cleanText);

    res.status(200).json({ recommendations: parsedIds });
  } catch (error) {
    console.error("Error in getAIRecommendations:", error.response?.data || error.message);
    res.status(500).json({
      message: "AI Recommendation failed",
      error: error.response?.data || error.message,
    });
  }
};
