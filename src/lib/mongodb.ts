import mongoose from "mongoose";

// Keep track of connection status
let isConnected = false;

// In-memory store for testing when no MongoDB is available
const inMemoryStore = {
  smsLimits: new Map(),
  otps: []
};

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test';

export const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    return;
  }

  // If in test mode, use in-memory store
  if (isTestMode) {
    console.log("Using in-memory store for testing");
    return;
  }

  // Otherwise connect to MongoDB
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error("MONGO_URI not defined in environment variables");
    }
    
    const db = await mongoose.connect(mongoUri);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

// Export in-memory store for testing
export const getInMemoryStore = () => {
  return inMemoryStore;
};
