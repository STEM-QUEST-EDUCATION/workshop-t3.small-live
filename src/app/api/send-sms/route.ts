// pages/api/send-sms/route.ts
import { NextResponse } from "next/server";
import OtpModel from "@/models/Otp";
import { connectDB } from "@/lib/mongodb";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSMS(
  mobileNumber: number,
  otp: string,
  name?: string
): Promise<boolean> {
  const SMS_API_KEY = process.env.TRUSTSIGNAL_SMS_API_KEY;
  const SMS_TRUSTSIGNAL_TEMPLATE_ID = process.env.SMS_TRUSTSIGNAL_TEMPLATE_ID;
  const SMS_TRUSTSIGNAL_SENDER_ID = process.env.SMS_TRUSTSIGNAL_SENDER_ID;

  if (
    !SMS_API_KEY ||
    !SMS_TRUSTSIGNAL_TEMPLATE_ID ||
    !SMS_TRUSTSIGNAL_SENDER_ID
  ) {
    throw new Error("Missing required environment variables for SMS sending.");
  }

  const TRUSTSIGNAL_URL = `https://api.trustsignal.io/v1/sms?api_key=${SMS_API_KEY}`;
  const data = {
    sender_id: SMS_TRUSTSIGNAL_SENDER_ID,
    to: [mobileNumber],
    route: "otp",
    message: `Dear ${name ? name : "User"} ,\nUse ${otp} to verify your number and enrol in the VIP Membership.\nGeniusLabs`,
    template_id: SMS_TRUSTSIGNAL_TEMPLATE_ID,
  };

  console.log("Sending SMS with data:", data);

  const response = await fetch(TRUSTSIGNAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error("Failed to send SMS:", await response.text());
    return false;
  }

  console.log("SMS sent successfully:", await response.json());
  return true;
}

export async function POST(req: Request) {
  try {
    const { mobileNumber, name } = await req.json();

    if (!mobileNumber) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDB();

    // Check if a non-expired, unverified OTP exists
    const existingOtp = await OtpModel.findOne({
      mobileNumber: String(mobileNumber),
      isVerified: false,
      expiresAt: { $gt: new Date() },
    });

    let otp = ""; 
    if (existingOtp) {
      // Reuse existing OTP
      otp = existingOtp.otp;
    } else {
      // Generate new OTP 
      otp = generateOTP();

      // Clean up old/verified OTPs directly
      await OtpModel.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isVerified: true },
        ],
      });

      // Save new OTP to the database
      const timestamp = Date.now();
      const otpDocument = new OtpModel({
        mobileNumber: String(mobileNumber),
        otp,
        timestamp,
        isVerified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      });

      try {
        const result = await otpDocument.save();
        console.log("OTP saved to database:", result);
      } catch (dbError) {
        console.error("Error saving OTP to database:", dbError);
        return NextResponse.json(
          { error: "Failed to save OTP to database" },
          { status: 500 }
        );
      }
    }

    // Send SMS with OTP (whether new or existing)
    const smsResult = await sendSMS(
      parseInt(mobileNumber, 10),
      otp,
      name
    );
    if (!smsResult) {
      // If sending fails, you might want to reconsider deleting the OTP here
      // to avoid potential issues with the user not receiving it. 
      return NextResponse.json(
        { error: "Failed to send OTP via SMS" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in generating OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}