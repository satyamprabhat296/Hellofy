
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
// CORS CONFIGURATION
// ================================
const allowedOrigins = [
  "http://localhost:5173",
  "https://hellofy-jet.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ================================
// MIDDLEWARE
// ================================
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// ================================
// API ROUTES
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
// HEALTH CHECK
// ================================
app.get("/", (req, res) => {
  res.json({
    message: "Hellofy API is running",
    status: "success",
  });
});

// ================================
// CODE EXECUTION - JDOODLE
// ================================

// Verify the versionIndex values against the runtimes available
// in your JDoodle account before relying on this mapping.
const JDOODLE_LANGUAGES = {
  javascript: { language: "nodejs", versionIndex: "4" },
  python: { language: "python3", versionIndex: "4" },
  cpp: { language: "cpp17", versionIndex: "1" },
  java: { language: "java", versionIndex: "4" },
};

app.post("/api/run-code", async (req, res) => {
  const { language, files, stdin = "" } = req.body ?? {};

  const script = files?.[0]?.content;

  // Validate the requested language and source code.
  if (
    !JDOODLE_LANGUAGES[language] ||
    typeof script !== "string" ||
    typeof stdin !== "string"
  ) {
    return res.status(400).json({
      message: "Invalid language, code, or input.",
    });
  }

  // Keep JDoodle credentials on the backend only.
  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("JDoodle credentials are missing.");

    return res.status(500).json({
      message: "Code execution is not configured on the server.",
    });
  }

  try {
    const selected = JDOODLE_LANGUAGES[language];

    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        clientId,
        clientSecret,
        script,
        stdin,
        language: selected.language,
        versionIndex: selected.versionIndex,
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    // JDoodle may return execution errors in its response body.
    if (result.error) {
      console.error("JDoodle returned an error:", result.error);

      return res.status(502).json({
        message:
          typeof result.error === "string"
            ? result.error
            : "JDoodle could not execute the code.",
      });
    }

    return res.status(200).json({
      run: {
        output: result.output ?? "",
        statusCode: result.statusCode,
        memory: result.memory,
        cpuTime: result.cpuTime,
      },
    });
  } catch (error) {
    console.error("JDoodle execution error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        message: "Code execution timed out. Please try again.",
      });
    }

    return res.status(502).json({
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Code execution service failed. Check the backend logs.",
    });
  }
});

// ================================
// SOCKET.IO INITIALIZATION
// ================================
initPairProgrammingSocket(server);

// ================================
// DATABASE CONNECTION
// ================================
connectDB()
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.log("Server will still start without the database.");
  });

// ================================
// START SERVER
// ================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);

  console.log(`Server + Socket.IO running on port ${PORT}`);
 
});
