"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBooking } from "@/contexts/BookingContext"; // Import the BookingContext

interface OtpVerificationProps {
  handleBack: () => void;
  setOtp: Dispatch<SetStateAction<string[]>>;
}

export default function OtpVerification({ handleBack, setOtp }: OtpVerificationProps) {
  const { parentPhone } = useBooking(); // Access the parent's phone number
  const [otp, _setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isVerified, setIsVerified] = useState(false); // Add this state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    return `00:${seconds.toString().padStart(2, "0")}`; // Corrected the formatting here
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    _setOtp(newOtp);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      // Reset OTP fields and timer
      _setOtp(Array(6).fill(""));
      setOtp(Array(6).fill(""));
      setTimeLeft(60);
      
      // Call the send-sms API
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: parentPhone }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send OTP");
      }

      // Show success message
      alert("New OTP has been sent to your phone number");
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Failed to resend OTP. Please try again.");
    }
  };

  const handleClose = () => {
    if (isVerified) {
      handleBack();
    } else {
      alert("Please verify your OTP before closing");
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    
    try {
      const response = await fetch("/api/validate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: parentPhone, otp: enteredOtp }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("OTP validated successfully:", data.message);
        setIsVerified(true); // Set verification status
        
        handleBack(); // Close the popup after successful verification
      } else {
        const errorData = await response.json();
        console.error("Failed to validate OTP:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error during OTP validation:", error);
      alert("An error occurred while validating OTP. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg p-4 w-[calc(100%-1rem)] max-w-md shadow-lg relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-0" 
          onClick={handleClose}  // Changed from handleBack to handleClose
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-pink-500" />
              <h2 className="text-lg font-semibold">Verify OTP sent to your number</h2>
            </div>
            <p className="text-gray-600">
              We have sent a 6-digit OTP to your phone number for verification.
            </p>
          </div>

          <div className="flex justify-center gap-2 ">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  inputRefs.current[index] = el; // Assign the ref
                }}
                className="w-10 h-10 md:w-12 md:h-12 text-center text-base  font-semibold bg-gray-50"
                maxLength={1}
              />
            ))}
          </div>

          <div className="text-center text-2xl font-semibold">
            {formatTime(timeLeft)}
          </div>

          <div className="text-center">
            <span className="text-gray-600">Didn&#39;t receive the code? </span>
            <Button
              variant="link"
              onClick={handleResend}
              className="text-[#00A0E4] p-0 h-auto font-normal"
              disabled={timeLeft > 0}
            >
              Resend
            </Button>
          </div>
          <Button
            className="w-full bg-[#00A0E4] text-white hover:bg-[#0090D4] mt-4"
            disabled={otp.some((digit) => digit === "")}
            onClick={handleVerify}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}