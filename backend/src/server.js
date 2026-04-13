import dotenv from "dotenv";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import axios from "axios";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";
import { initPairProgrammingSocket } from "./socket/pairProgramming.js";
import aiRoutes from "./routes/ai.js";
import resourceRoutes from "./routes/resource.js";
import paymentRoutes from "./routes/payment.routes.js";
import premiumRoutes from "./routes/premium.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);

// 🔧 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 🚏 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/admin", adminRoutes);

// ================================
// ✅ CODE EXECUTION ROUTE
// ================================

app.get("/", (req, res) => {
  res.json({
    message: "Hellofy API is running 🚀",
    status: "success"
  });
});
app.post("/api/run-code", async (req, res) => {
  try {
    const { language, files } = req.body;

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language,
        version: "*",
        files: [
          {
            name: "main.js",
            content: files[0].content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Code execution error:",
      error.response?.data || error.message
    );

    res.json({
      run: {
        output:
          "⚠️ Code execution failed (API blocked or unavailable).",
      },
    });
  }
});
// ================================

// 🔌 Initialize Socket.IO
initPairProgrammingSocket(server);

const PORT = process.env.PORT || 5000;

// ================================
// ✅ FIX: DON'T BLOCK SERVER IF DB FAILS
// ================================
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB failed:", err.message);
    console.log("⚠️ Server will still start without DB");
  });

// ✅ ALWAYS START SERVER
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});