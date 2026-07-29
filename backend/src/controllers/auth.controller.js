import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ================================
// 🔐 Helper: Generate Token
// ================================
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

// ================================
// 🍪 Helper: Set Cookie (FIXED)
// ================================
const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "None", // ✅ REQUIRED for cross-origin (Vercel)
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in prod
  });
};

// ================================
// 📝 SIGNUP
// ================================
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, use a different one" });
    }

    // 🎲 Random Avatar
    const idx = Math.floor(Math.random() * 100) + 1;
// 🎲 Random Avatar (unique)
const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`;
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // 🔁 Stream user (safe)
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`✅ Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("⚠️ Stream user error:", error.message);
    }

    const token = generateToken(newUser._id);
    setTokenCookie(res, token);

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================================
// 🔑 LOGIN
// ================================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ================================
// 🚪 LOGOUT
// ================================
export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

// ================================
// 🧑‍💻 ONBOARD USER
// ================================
export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const {
      fullName,
      bio,
      profilePic,
      location,
      languagesToTeach,
      languagesToLearn,
      experienceLevel,
      techStack,
      github,
      portfolio,
      website,
    } = req.body;

    // 🧩 Validation
    if (
      !fullName ||
      !bio ||
      !location ||
      !languagesToTeach?.length ||
      !languagesToLearn?.length
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !location && "location",
          (!languagesToTeach || !languagesToTeach.length) &&
            "languagesToTeach",
          (!languagesToLearn || !languagesToLearn.length) &&
            "languagesToLearn",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        profilePic,
        location,
        languagesToTeach,
        languagesToLearn,
        experienceLevel: experienceLevel || "Beginner",
        techStack: techStack || [],
        github: github || "",
        portfolio: portfolio || "",
        website: website || "",
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔁 Sync Stream
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `✅ Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (err) {
      console.log("⚠️ Stream update error:", err.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("❌ Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};