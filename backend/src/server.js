import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true // alow frontend to send cookies
}));
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes); 
app.use("/api/chat", chatRoutes); 

const PORT = process.env.PORT || 5000; 


connectDB().then(() => {  
  app.listen(PORT, () => {  
    console.log(`🚀 Server running on port ${PORT}`); 
  }); 
}); 
