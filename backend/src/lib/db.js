import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "HELLOFY_db", // ✅ FORCE DB NAME
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log("📦 DB Name:", conn.connection.name);

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // ⛔ STOP if DB fails
  }
};   