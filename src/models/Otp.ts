// models/Otp.ts
import mongoose, { Schema, Model } from 'mongoose';

interface Otp {
  mobileNumber: string;
  otp: string;
  timestamp: Date; 
  isVerified: boolean;
  expiresAt: Date; 
}

const otpSchema = new Schema<Otp>({
  mobileNumber: { type: String, required: true },
  otp: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true } 
});

const OtpModel: Model<Otp> = mongoose.models.Otp || mongoose.model<Otp>('Otp', otpSchema);

export default OtpModel;
