// pages/api/send-sms/route.ts
import { NextResponse } from "next/server";
import OtpModel from "@/models/Otp";
import { connectDB } from "@/lib/mongodb";

function generateOTP(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated OTP:', otp);
  return otp;
}

async function sendSMS(
  mobileNumber: number,
  otp: string,
  name?: string
): Promise<boolean> {
  const SMS_API_KEY = process.env.TRUSTSIGNAL_SMS_API_KEY;
  const SMS_TRUSTSIGNAL_TEMPLATE_ID = process.env.SMS_TRUSTSIGNAL_TEMPLATE_ID;
  const SMS_TRUSTSIGNAL_SENDER_ID = process.env.SMS_TRUSTSIGNAL_SENDER_ID;

  if (!SMS_API_KEY || !SMS_TRUSTSIGNAL_TEMPLATE_ID || !SMS_TRUSTSIGNAL_SENDER_ID) {
    return false;
  }

  try {
    const TRUSTSIGNAL_URL = `https://api.trustsignal.io/v1/sms?api_key=${SMS_API_KEY}`;
    
    const data = {
      sender_id: SMS_TRUSTSIGNAL_SENDER_ID,
      to: [mobileNumber],
      route: "otp",
      message: `Dear ${name || "User"},\nUse ${otp} to verify your number and enrol in the VIP Membership.\nGeniusLabs`,
      template_id: SMS_TRUSTSIGNAL_TEMPLATE_ID,
    };

    const response = await fetch(TRUSTSIGNAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mobileNumber, name, transactionId } = body;

    if (!mobileNumber || !transactionId) {
      return NextResponse.json(
        { error: "Mobile number and transaction ID are required" },
        { status: 400 }
      );
    }

    await connectDB();

    try {
      await OtpModel.deleteMany({
        mobileNumber: String(mobileNumber),
        transactionId,
        isVerified: false
      });

      const otp = generateOTP();
      
      const otpDocument = new OtpModel({
        mobileNumber: String(mobileNumber),
        transactionId,
        otp,
        timestamp: new Date(),
        isVerified: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
      });

      await otpDocument.save();

      const smsResult = await sendSMS(
        parseInt(mobileNumber, 10),
        otp,
        name
      );

      if (!smsResult) {
        await OtpModel.deleteOne({ _id: otpDocument._id });
        return NextResponse.json(
          { error: "Failed to send OTP via SMS" },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        message: "OTP sent successfully" 
      });

    } catch (error) {
      console.error('OTP processing failed:', error);
      return NextResponse.json(
        { error: "Failed to process OTP request" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Request processing failed:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}