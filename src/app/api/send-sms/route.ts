// pages/api/send-sms/route.ts
import { NextResponse } from "next/server";
import OtpModel from "@/models/Otp";
import SmsLimitModel from "@/models/SmsLimit";
import { connectDB } from "@/lib/mongodb";

// Maximum number of SMS a user can receive in a day
const MAX_SMS_PER_DAY = 10;
// Maximum number of SMS a user can receive in an hour
const MAX_SMS_PER_HOUR = 5;
// Minimum time between OTP resend attempts (in minutes)
const MIN_RESEND_TIME_MINUTES = 1;

function generateOTP(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated OTP:', otp);
  return otp;
}

// Check if a user has exceeded their SMS limit
async function checkSmsLimit(mobileNumber: string, transactionId: string): Promise<{ allowed: boolean; retryAfter?: string }> {
  try {
    // First, check if there's a recent OTP for this transaction
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - (MIN_RESEND_TIME_MINUTES * 60 * 1000));
    
    const recentOtp = await OtpModel.findOne({
      mobileNumber,
      transactionId,
      timestamp: { $gt: oneMinuteAgo }
    });
    
    if (recentOtp) {
      // Calculate time until they can resend
      const cooldownEnds = new Date(recentOtp.timestamp);
      cooldownEnds.setMinutes(cooldownEnds.getMinutes() + MIN_RESEND_TIME_MINUTES);
      const secondsRemaining = Math.ceil((cooldownEnds.getTime() - now.getTime()) / 1000);
      
      return {
        allowed: false,
        retryAfter: `Please wait ${secondsRemaining} seconds before requesting another OTP`
      };
    }
    
    // Check rate limits if cooldown check passes
    let smsLimitRecord = await SmsLimitModel.findOne({ mobileNumber });
    
    if (!smsLimitRecord) {
      // Create a new SMS limit record using the appropriate method
      // For both mongoose model and our mock model
      smsLimitRecord = await SmsLimitModel.findOneAndUpdate(
        { mobileNumber },
        { 
          $set: { 
            smsCount: 0,
            lastReset: new Date(),
            hourlySmsCount: 0,
            lastHourlyReset: new Date()
          }
        },
        { upsert: true, new: true }
      );
    }
    
    // Check if it's a new day since last reset
    const lastReset = new Date(smsLimitRecord.lastReset);
    
    // Reset daily counter if it's a new day
    if (now.getDate() !== lastReset.getDate() || 
        now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      
      // Update with reset count
      await SmsLimitModel.findOneAndUpdate(
        { mobileNumber },
        { 
          $set: { 
            smsCount: 0,
            lastReset: now
          }
        },
        { upsert: true, new: true }
      );
      
      // Update our local record
      smsLimitRecord.smsCount = 0;
      smsLimitRecord.lastReset = now;
    }
    
    // Check if it's been at least an hour since the last hourly reset
    const lastHourlyReset = new Date(smsLimitRecord.lastHourlyReset || now);
    const hoursSinceLastReset = (now.getTime() - lastHourlyReset.getTime()) / (1000 * 60 * 60);
    
    // Reset hourly counter if it's been more than an hour
    if (hoursSinceLastReset >= 1) {
      await SmsLimitModel.findOneAndUpdate(
        { mobileNumber },
        { 
          $set: { 
            hourlySmsCount: 0,
            lastHourlyReset: now
          }
        },
        { upsert: true, new: true }
      );
      
      // Update our local record
      smsLimitRecord.hourlySmsCount = 0;
      smsLimitRecord.lastHourlyReset = now;
    }
    
    // Check if user has exceeded daily limit
    if (smsLimitRecord.smsCount >= MAX_SMS_PER_DAY) {
      // Calculate time until next day reset
      const tomorrow = new Date(lastReset);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const timeUntilReset = Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60));
      
      return { 
        allowed: false,
        retryAfter: `Daily limit reached (${MAX_SMS_PER_DAY} SMS). Try again in ${Math.floor(timeUntilReset / 60)} hours and ${timeUntilReset % 60} minutes`
      }; 
    }
    
    // Check if user has exceeded hourly limit
    if (smsLimitRecord.hourlySmsCount >= MAX_SMS_PER_HOUR) {
      // Calculate time until hourly reset
      const nextHourReset = new Date(lastHourlyReset);
      nextHourReset.setHours(nextHourReset.getHours() + 1);
      const minutesUntilReset = Math.ceil((nextHourReset.getTime() - now.getTime()) / (1000 * 60));
      
      return { 
        allowed: false,
        retryAfter: `Hourly limit reached (${MAX_SMS_PER_HOUR} SMS). Try again in ${minutesUntilReset} minutes`
      };
    }
    
    // Increment both daily and hourly counts
    await SmsLimitModel.findOneAndUpdate(
      { mobileNumber },
      { 
        $inc: { 
          smsCount: 1,
          hourlySmsCount: 1 
        } 
      },
      { upsert: true, new: true }
    );
    
    return { allowed: true }; // Under limit
  } catch (error) {
    console.error('Error checking SMS limit:', error);
    return { allowed: false, retryAfter: "Server error, please try again later" }; // Error defaults to limiting SMS
  }
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
      // Check if user has exceeded SMS limit
      const formattedMobile = String(mobileNumber).trim();
      const { allowed, retryAfter } = await checkSmsLimit(formattedMobile, transactionId);
      
      if (!allowed) {
        return NextResponse.json(
          { error: retryAfter },
          { status: 429 } // Too Many Requests
        );
      }
      
      // Continue with normal flow - delete any existing unverified OTPs for this transaction
      await OtpModel.deleteMany({
        mobileNumber: formattedMobile,
        transactionId,
        isVerified: false
      });

      const otp = generateOTP();
      
      // Create a new OTP document using create method which works for both models
      const otpDocument = await OtpModel.create({
        mobileNumber: formattedMobile,
        transactionId,
        otp,
        timestamp: new Date(),
        isVerified: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
      });

      const smsResult = await sendSMS(
        parseInt(mobileNumber, 10),
        otp,
        name
      );

      if (!smsResult) {
        // If SMS fails, decrement the count to not penalize the user
        await SmsLimitModel.findOneAndUpdate(
          { mobileNumber: formattedMobile },
          { $inc: { smsCount: -1, hourlySmsCount: -1 } },
          { upsert: true, new: true }
        );
        
        // Delete the OTP document
        await OtpModel.deleteOne({ _id: otpDocument._id });
        
        return NextResponse.json(
          { error: "Failed to send OTP via SMS" },
          { status: 500 }
        );
      }

      // Get remaining quota
      const smsLimitRecord = await SmsLimitModel.findOne({ mobileNumber: formattedMobile });
      const remainingDailyQuota = MAX_SMS_PER_DAY - (smsLimitRecord?.smsCount || 0);
      const remainingHourlyQuota = MAX_SMS_PER_HOUR - (smsLimitRecord?.hourlySmsCount || 0);

      return NextResponse.json({ 
        success: true,
        message: "OTP sent successfully",
        remainingQuota: {
          daily: {
            remaining: remainingDailyQuota,
            maximum: MAX_SMS_PER_DAY
          },
          hourly: {
            remaining: remainingHourlyQuota,
            maximum: MAX_SMS_PER_HOUR
          }
        },
        cooldown: {
          minutes: MIN_RESEND_TIME_MINUTES
        }
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