// pages/api/validate-otp/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OtpModel from "@/models/Otp";
import { BookingModel } from "@/models/Booking"; 

async function isValidOTP(mobileNumber: string, otp: string): Promise<boolean> {
  try {
    console.log("\n=== Starting OTP Validation ===");
    console.log("Input received - Mobile:", mobileNumber, "OTP:", otp);

    await connectDB();
    console.log("Database connected successfully");

    // First, let's check all existing OTPs for this number (for debugging)
    const allOtps = await OtpModel.find({ mobileNumber }).sort({ timestamp: -1 });
    console.log("\nAll OTPs found for this number:", 
      allOtps.map(otp => ({
        otp: otp.otp,
        isVerified: otp.isVerified,
        expiresAt: otp.expiresAt,
        timestamp: new Date(otp.timestamp)
      }))
    );

    // Find the most recent non-verified OTP
    const query = { 
      mobileNumber,
      isVerified: false,
      expiresAt: { $gt: new Date() }
    };
    console.log("\nSearching with query:", JSON.stringify(query, null, 2));

    const otpRecord = await OtpModel.findOne(query).sort({ timestamp: -1 });
    console.log("\nMost recent valid OTP record:", otpRecord);

    if (!otpRecord) {
      console.log("No valid OTP record found. Validation failed.");
      return false;
    }

    // Check if OTP matches
    const isMatch = otpRecord.otp === otp;
    console.log("\nOTP Match check:");
    console.log("Stored OTP:", otpRecord.otp);
    console.log("Provided OTP:", otp);
    console.log("Do they match?", isMatch);

    if (isMatch) {
      console.log("\nOTP matched. Updating records...");
      
      // Mark this OTP as verified
      const updateResult = await OtpModel.findByIdAndUpdate(otpRecord._id, {
        isVerified: true
      });
      console.log("Update result for matched OTP:", updateResult);

      // Invalidate all other OTPs
      const invalidateResult = await OtpModel.updateMany(
        { 
          mobileNumber,
          _id: { $ne: otpRecord._id }
        },
        { 
          isVerified: true,
          expiresAt: new Date()
        }
      );
      console.log("Invalidate other OTPs result:", invalidateResult);
    }

    console.log("\nFinal validation result:", isMatch);
    return isMatch;

  } catch (error) {
    console.error("\nError in isValidOTP:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    console.log("\n=== OTP Validation Request Started ===");
    const body = await req.json();
    console.log("Request body received:", body);

    const { mobileNumber, otp } = body;

    // Input validation
    if (!mobileNumber || !otp) {
      console.log("Missing required fields:", { mobileNumber, otp });
      return NextResponse.json(
        { 
          success: false,
          error: "Mobile number and OTP are required" 
        },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      console.log("Invalid OTP format:", otp);
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid OTP format. OTP must be 6 digits." 
        },
        { status: 400 }
      );
    }

    console.log("\nCleaning up old OTPs...");
    // Clean up expired OTPs
    const cleanupResult = await OtpModel.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isVerified: true }
      ]
    });
    console.log("Cleanup result:", cleanupResult);

    const isValid = await isValidOTP(mobileNumber, otp);
    console.log("\nFinal validation status:", isValid);

    if (isValid) {
      // Update otp_verified in BookingModel if OTP is valid
      const updateResult = await BookingModel.findOneAndUpdate(
        { ph_number: mobileNumber }, 
        { otp_verified: true }
      );
      console.log("Booking Model update result:", updateResult); 

      return NextResponse.json({ 
        success: true,
        message: "OTP validated successfully" 
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid or expired OTP" 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("\nError in validation endpoint:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}
