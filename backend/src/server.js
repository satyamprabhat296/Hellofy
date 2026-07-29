import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import axios from "axios";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import aiRoutes from "./routes/ai.js";
import resourceRoutes from "./routes/resource.js";
import paymentRoutes from "./routes/payment.routes.js";
import premiumRoutes from "./routes/premium.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { connectDB } from "./lib/db.js";
import { initPairProgrammingSocket } from "./socket/pairProgramming.js";

const app = express();
const server = createServer(app);

// ================================
// ✅ CORS CONFIG (FIXED)
// ================================
const allowedOrigins = [
  "http://localhost:5173",                // local frontend
  "https://hellofy-jet.vercel.app"       // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ================================
// 🔧 Middleware
// ================================
app.use(express.json());
app.use(cookieParser());

// ================================
// 🚏 API Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/admin", adminRoutes);

// ================================
// ✅ HEALTH CHECK
// ================================
app.get("/", (req, res) => {
  res.json({
    message: "Hellofy API is running 🚀",
    status: "success",
  });
});

// ================================
// ✅ CODE EXECUTION ROUTE
// ================================
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
        output: "⚠️ Code execution failed (API blocked or unavailable).",
      },
    });
  }
});

// ================================
// 🔌 SOCKET.IO INIT
// ================================
initPairProgrammingSocket(server);

// ================================
// 🗄️ DATABASE CONNECTION
// ================================
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB failed:", err.message);
    console.log("⚠️ Server will still start without DB");
  });

// ================================
// 🚀 START SERVER
// ================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});