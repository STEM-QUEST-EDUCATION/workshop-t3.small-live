// pages/api/validate-otp/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OtpModel, { OtpQuery, SortOptions } from "@/models/Otp";
import { BookingModel } from "@/models/Booking"; 

async function isValidOTP(mobileNumber: string, otp: string, transactionId: string): Promise<boolean> {
  try {
    console.log('Validating OTP with:', { mobileNumber, otp, transactionId });

    // Ensure consistent string format for mobile number
    const formattedMobile = String(mobileNumber).trim();
    const formattedOtp = String(otp).trim();

    // Find the latest OTP for this transaction
    const query: OtpQuery = {
      mobileNumber: formattedMobile,
      transactionId,
      isVerified: false,
      expiresAt: { $gt: new Date() }
    };
    
    // Create and use the OTP query with proper type handling
    const otpQuery = OtpModel.findOne(query);
    
    // The sort operation is handled differently based on implementation
    const sortOptions: SortOptions = { timestamp: -1 };
    const otpRecord = await (otpQuery as any).sort(sortOptions);

    console.log('Found OTP record:', otpRecord);

    if (!otpRecord) {
      console.log('No valid OTP found for:', { formattedMobile, transactionId });
      return false;
    }

    // Check if OTP matches
    const matches = formattedOtp === otpRecord.otp;
    console.log('OTP comparison:', { 
      provided: formattedOtp, 
      stored: otpRecord.otp,
      matches 
    });

    if (!matches) {
      return false;
    }

    // Mark this OTP as verified
    const updatedOtp = await OtpModel.findByIdAndUpdate(
      otpRecord._id,
      { $set: { isVerified: true } },
      { new: true }
    );
    console.log('Updated OTP record:', updatedOtp);

    // Update booking with verified status
    const updatedBooking = await BookingModel.findOneAndUpdate(
      { "payment.Transaction_ID": transactionId },
      { $set: { otp_verified: true } },
      { new: true }
    );
    console.log('Updated booking:', updatedBooking);

    return true;
  } catch (error) {
    console.error("Error validating OTP:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { mobileNumber, otp, transactionId } = await req.json();
    console.log('Received validation request:', { mobileNumber, otp, transactionId });

    if (!mobileNumber || !otp || !transactionId) {
      return NextResponse.json(
        { success: false, error: "Mobile number, OTP, and transaction ID are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const isValid = await isValidOTP(mobileNumber, otp, transactionId);
    console.log('Validation result:', isValid);

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: "OTP validated successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in validation endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
