// pages/booking/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BookingForm } from "./components/BookingForm";
import Image from "next/image";
import { useBooking } from "@/contexts/BookingContext";
import { useRouter } from "next/navigation";

interface StudentDetails {
  id: string;
  name: string;
  age: string;
}

interface ParentContact {
  phone1: string;
  phone2: string;
}

interface PhoneErrors {
  phone1: string;
  phone2: string;
}

interface EasebuzzCheckoutOptions {
  access_key: string;
  onResponse: (response: { status: string; message: string }) => void;
  theme: string;
}

interface EasebuzzCheckoutInstance {
  initiatePayment: (options: EasebuzzCheckoutOptions) => void;
}

declare global {
  interface Window {
    EasebuzzCheckout: new (
      key: string,
      env: string
    ) => EasebuzzCheckoutInstance;
  }
}

export default function HomePage() {
  const {
    workshopDetails,
    bookingData,
    setTransactionId,
    transactionId,
    orderTotal,
    parentPhone,
    setBookingData,
  } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [studentCount, setStudentCount] = useState<string>("");
  const [students, setStudents] = useState<StudentDetails[]>([]);
  const [parentContact, setParentContact] = useState<ParentContact>({
    phone1: "",
    phone2: "",
  });
  const [paymentType, setPaymentType] = useState<"now" | "later" | null>(null);
  const [phoneErrors, setPhoneErrors] = useState<PhoneErrors>({
    phone1: "",
    phone2: "",
  });
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const easebuzzScript = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    easebuzzScript.current = document.createElement("script");
    easebuzzScript.current.src =
      "https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js";
    easebuzzScript.current.async = true;
    document.head.appendChild(easebuzzScript.current);

    return () => {
      if (easebuzzScript.current) {
        document.head.removeChild(easebuzzScript.current);
      }
    };
  }, []);

  const handleMakePayment = useCallback(async () => {
    setPaymentInitiated(true);

    try {
      if (!transactionId) {
        console.error("Transaction ID is not available");
        setPaymentInitiated(false);
        return;
      }

      const paymentData = {
        workshop_id: workshopDetails.id,
        transactionId,
        amount: orderTotal,
        product_info: workshopDetails.name, // Add workshopDetails.name as dependency
        firstname: bookingData.children[0]?.name,
        phone: parentPhone,
        email: "workshop.payments@geniuslabs.live",
        time: workshopDetails.time, // Add workshopDetails.time as dependency
      };

      const response = await fetch("/api/make-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.paymentUrl) {
          const accessKey = data.paymentUrl;

          if (typeof window.EasebuzzCheckout === "function") {
            const easebuzzCheckout = new window.EasebuzzCheckout(
              `process.env.NEXT_PUBLIC_EASEBUZZ_KEY`,
              "prod"
            );
            const options: EasebuzzCheckoutOptions = {
              access_key: accessKey,
              onResponse: async (response: {
                status: string;
                message: string;
              }) => {
                console.log("Response from Easebuzz:", response);
                setIsVerifying(true);

                try {
                  const verifyPaymentResponse = await fetch(
                    "/api/verify-payment",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ response, accessKey }),
                    }
                  );

                  if (verifyPaymentResponse.ok) {
                    console.log("Payment verification successful");
                    router.push("/payment?status=success");
                  } else {
                    console.error("Payment verification failed");
                    router.push(
                      "/payment?status=failure&error=verification_failed"
                    );
                  }
                } catch (error) {
                  console.error("Payment verification error:", error);
                  router.push("/payment?status=failure&error=verification_error");
                } finally {
                  setIsVerifying(false);
                }
              },
              theme: "#123456",
            };
            easebuzzCheckout.initiatePayment(options);
          } else {
            console.error("EasebuzzCheckout is not loaded.");
            setPaymentInitiated(false);
          }
        } else {
          console.error("Payment initiation failed:", data.message);
          setPaymentInitiated(false);
        }
      } else {
        console.error("Error initiating payment.");
        setPaymentInitiated(false);
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setPaymentInitiated(false);
    }
  }, [
    workshopDetails,
    bookingData,
    transactionId,
    orderTotal,
    parentPhone,
    router,
  ]); // Add `workshopDetails.name` and `workshopDetails.time` here

  const handleSendOTP = useCallback(async () => {
    if (!parentContact.phone1) {
      setPhoneErrors((prev) => ({
        ...prev,
        phone1: "Primary phone number is required",
      }));
      return;
    }

    try {
      const childDetails = bookingData.children.map((child) => ({
        childname: child.name,
        age: parseInt(child.age, 10),
      }));

      
      const totalCost = workshopDetails.price * bookingData.children.length;

      const paymentData = {
        workshop_id: workshopDetails.id,
        children: childDetails,
        ph_number: parentContact.phone1,
        orderTotal: totalCost,
        product_info: workshopDetails.name,
        time: workshopDetails.time,
        paymentType: paymentType // Add payment type to identify offline/online
      };

      // Save initial payment information
      const savePaymentResponse = await fetch("/api/save-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!savePaymentResponse.ok) {
        throw new Error("Failed to save payment information. Please try again.");
      }

      const savePaymentResult = await savePaymentResponse.json();
      const savedTransactionId = savePaymentResult.paymentId;
      setTransactionId(savedTransactionId);

      // If it's offline payment, update the booking with offline details
      if (paymentType === 'later') {
        const offlineUpdateResponse = await fetch("/api/save-offline-booking", {
          method: "PUT", // Using PUT to update existing booking
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: savedTransactionId,
            workshopDetails,
            bookingData,
            parentPhone: parentContact.phone1,
            orderTotal: totalCost,
          }),
        });

        if (!offlineUpdateResponse.ok) {
          throw new Error("Failed to update offline booking details.");
        }

        const offlineResult = await offlineUpdateResponse.json();
        localStorage.setItem('receiptNumber', offlineResult.receiptNumber);
      }

      // Send OTP
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: parentContact.phone1,
          name: "Parent",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP. Please try again.");
      }

      setShowOtpPopup(true);
    } catch (error) {
      setPhoneErrors((prev) => ({
        ...prev,
        phone1:
          error instanceof Error
            ? error.message || "Failed to send OTP"
            : "An unexpected error occurred",
      }));
    }
  }, [parentContact.phone1, bookingData, workshopDetails, paymentType, setTransactionId]);

  const updateStudents = useCallback((count: number) => {
    setStudents((prevStudents) => {
      if (prevStudents.length !== count) {
        return Array(count)
          .fill(null)
          .map((_, index) => ({
            id: `student-${index}`,
            name: prevStudents[index]?.name || "",
            age: prevStudents[index]?.age || "",
          }));
      }
      return prevStudents;
    });
  }, []);

  useEffect(() => {
    if (studentCount) {
      const count = parseInt(studentCount, 10);
      updateStudents(count);
    }
  }, [studentCount, updateStudents]);

  const resetAllFields = useCallback(() => {
    setStudentCount("");
    setStudents([]);
    setParentContact({ phone1: "", phone2: "" });
    setPaymentType(null);
    setPhoneErrors({ phone1: "", phone2: "" });
  }, []);

  const handleBack = useCallback(() => {
    setStep((prevStep) => {
      if (prevStep > 1) {
        const newStep = (prevStep - 1) as 1 | 2 | 3 | 4;
        if (newStep === 1) {
          resetAllFields();
        }
        return newStep;
      } else if (prevStep === 1) {
        // Redirect to the workshop details page

        router.push(`/${workshopDetails.id}`);
      }
      return prevStep;
    });
  }, [resetAllFields, router, workshopDetails]);

  const handleNext = useCallback(() => {
    setStep((prevStep) => {
      if (
        prevStep === 2 &&
        !students.some((student) => !student.name || !student.age)
      ) {
        return 3;
      } else if (
        prevStep === 3 &&
        parentContact.phone1 &&
        !phoneErrors.phone1 &&
        !phoneErrors.phone2
      ) {
        setShowOtpPopup(true);
        return 4;
      }
      return prevStep;
    });
  }, [students, parentContact, phoneErrors]); // Removed showOtpPopup from dependencies

  const handleCloseOtpPopup = useCallback(() => {
    setShowOtpPopup(false);
    
  }, []);

  // HomePage.tsx
const handleOtpVerified = useCallback(() => {
  setStep(4);
}, []);

  const isNextDisabled = useCallback(() => {
    if (step === 1) return studentCount === "";
    if (step === 2) {
      return (
        students.length === 0 ||
        students.some((student) => {
          const age = parseInt(student.age, 10);
          return (
            !student.name || !student.age || isNaN(age) || age < 4 || age > 15
          );
        })
      );
    }
    if (step === 3)
      return (
        !parentContact.phone1 ||
        phoneErrors.phone1 !== "" ||
        phoneErrors.phone2 !== ""
      );
    return !paymentType;
  }, [step, studentCount, students, parentContact, phoneErrors, paymentType]);

  const handleGenerateTicket = useCallback(async () => {
    console.log("Generate ticket");
    
    try {
      const response = await fetch("/api/save-offline-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workshopDetails,
          bookingData,
          parentPhone,
          orderTotal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save offline booking");
      }

      const data = await response.json();
      if (data.success) {
        // First update the context and localStorage
        await Promise.all([
          setTransactionId(data.transactionId),
          setBookingData(prev => ({
            ...prev,
            payment: {
              ...prev.payment,
              transactionId: data.transactionId,
              method: 'later',
              status: 'pending'
            }
          }))
        ]);

        // Store in localStorage
        localStorage.setItem('transactionId', data.transactionId);
        localStorage.setItem('receiptNumber', data.receiptNumber);

        // Add a small delay to ensure state updates are processed
        await new Promise(resolve => setTimeout(resolve, 200));

        // Then redirect with the transaction ID as a query parameter
        router.push(`/payment?status=success&type=offline&txnId=${data.transactionId}`);
      } else {
        throw new Error(data.error || "Failed to save offline booking");
      }
    } catch (error) {
      console.error("Error generating ticket:", error);
      alert("Failed to generate ticket. Please try again.");
    }
  }, [workshopDetails, bookingData, parentPhone, orderTotal, router, setTransactionId, setBookingData]);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-5">
      {isVerifying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A0E4] mx-auto mb-4"></div>
            <p className="text-gray-700">Verifying payment...</p>
          </div>
        </div>
      )}
      <header className="top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center justify-between px-5 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2"
          >
            <Image
              src="icons/back-arrow.svg"
              alt="Back"
              width={25}
              height={25}
              className="w-4 h-4 bg-gray-50 z-10"
            />
          </Button>
          <h1 className="text-lg font-extrabold mx-auto absolute left-0 right-0 text-center">
            {step === 4 ? "Confirm Booking" : "Booking Form"}
          </h1>
        </div>
      </header>

      <main className="px-5 py-6 mb-9">
        <BookingForm
          step={step}
          studentCount={studentCount}
          setStudentCount={setStudentCount}
          students={students}
          setStudents={setStudents}
          parentContact={parentContact}
          setParentContact={setParentContact}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          setStep={setStep}
          resetAllFields={resetAllFields}
          phoneErrors={phoneErrors}
          setPhoneErrors={setPhoneErrors}
          showOtpPopup={showOtpPopup}
          closePopup={handleCloseOtpPopup}
          handleSendOTP={handleSendOTP}
          onOtpVerified={handleOtpVerified}

        />
      </main>

      <div className="max-w-md mx-auto fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-[#F5FAFF] text-[#00A0E4] border-[#00A0E4] rounded-xl font-medium text-sm"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            className="flex-1 bg-[#00A0E4] text-white hover:bg-[#0090D4] rounded-xl font-medium text-sm"
            disabled={
              isNextDisabled() ||
              (step === 3 && showOtpPopup) ||
              paymentInitiated
            }
            onClick={() => {
              if (step === 3) {
                handleSendOTP();
              } else if (step === 4) {
                if (paymentType === 'later') {
                  handleGenerateTicket();
                } else {
                  handleMakePayment();
                }
              } else {
                handleNext();
              }
            }}
          >
            {step === 3 && !showOtpPopup
              ? "Verify OTP"
              : step === 4
                ? paymentType === 'later'
                  ? "Generate Ticket"
                  : "Make Payment"
                : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
