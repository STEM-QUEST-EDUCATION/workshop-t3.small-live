import mongoose from "mongoose";

let isConnected = false; // Track connection status globally

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection.");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
