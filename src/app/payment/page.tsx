// src/app/payment/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import PaymentSuccess from "./components/PaymentSuccess";

function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const error = searchParams.get("error");

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-lg">
        {status === "success" ? (
          <PaymentSuccess />
        ) : (
          <div className="text-center space-y-4">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-gray-600">
              {error === "verification_failed"
                ? "Payment verification failed. Please try again."
                : "There was an error processing your payment. Please try again."}
            </p>
            <div className="mt-6">
              <Button
                onClick={handleBackToHome}
                className="w-full bg-[#00A0E4] hover:bg-[#0090D4]"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatus />
    </Suspense>
  );
}
