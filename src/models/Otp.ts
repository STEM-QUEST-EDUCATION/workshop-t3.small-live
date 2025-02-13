// models/Otp.ts
import mongoose, { Schema, Model } from 'mongoose';

interface Otp {
  mobileNumber: string;
  otp: string;
  timestamp: Date; 
  isVerified: boolean;
  expiresAt: Date; 
  transactionId: string;
}

const otpSchema = new Schema<Otp>({
  mobileNumber: { type: String, required: true },
  otp: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }, 
  transactionId: { type: String, required: true }, 
});

// Remove any existing indexes
if (mongoose.models.Otp) {
  delete mongoose.models.Otp;
}

// Create a compound index for mobileNumber and transactionId
otpSchema.index({ mobileNumber: 1, transactionId: 1 });

const OtpModel: Model<Otp> = mongoose.models.Otp || mongoose.model<Otp>('Otp', otpSchema);

export default OtpModel;
