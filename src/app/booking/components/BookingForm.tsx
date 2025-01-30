"use client";

import { Dispatch, SetStateAction, Suspense } from "react";
import dynamic from "next/dynamic";
import { SummaryCard } from "./SummaryCard";
import OtpVerification from "./OtpVerification";
const Step1SelectStudents = dynamic(() => import("./Step1SelectStudents"));
const Step2StudentsDetails = dynamic(() => import("./Step2StudentsDetails"));
const Step3ParentContact = dynamic(() => import("./Step3ParentContact"));
const Step4PaymentType = dynamic(() => import("./Step4PaymentType"));

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

interface BookingFormProps {
  step: 1 | 2 | 3 | 4; // Ensures step supports values 1 to 4
  studentCount: string;
  setStudentCount: Dispatch<SetStateAction<string>>;
  students: StudentDetails[];
  setStudents: Dispatch<SetStateAction<StudentDetails[]>>;
  parentContact: ParentContact;
  setParentContact: Dispatch<SetStateAction<ParentContact>>;
  paymentType: "now" | "later" | null;
  setPaymentType: Dispatch<SetStateAction<"now" | "later" | null>>;
  setStep: Dispatch<SetStateAction<1 | 2 | 3 | 4>>;
  resetAllFields: () => void;
  phoneErrors: PhoneErrors;
  setPhoneErrors: Dispatch<SetStateAction<PhoneErrors>>;
  showOtpPopup: boolean;
  onCloseOtpPopup: () => void;
  handleSendOTP: () => void;
}

export function BookingForm({
  step,
  studentCount,
  setStudentCount,
  students,
  setStudents,
  parentContact,
  setParentContact,
  paymentType,
  setPaymentType,
  setStep,
  resetAllFields,
  phoneErrors,
  setPhoneErrors,
  showOtpPopup,
  onCloseOtpPopup,
}: BookingFormProps) {
  const handleAddStudent = () => {
    if (students.length < 4) {
      const newCount = students.length + 1;
      setStudentCount(newCount.toString());
      setStudents((prev) => [
        ...prev,
        { id: `student-${newCount}`, name: "", age: "" },
      ]);
    }
  };

  const handleRemoveStudent = () => {
    if (students.length > 1) {
      const newCount = students.length - 1;
      setStudentCount(newCount.toString());
      setStudents((prev) => prev.slice(0, -1));
    } else if (students.length === 1) {
      resetAllFields();
      setStep(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-[#00A0E4] font-bold text-base">
              Step {step} :{" "}
            </span>
            {step === 1 ? (
              <span className="text-base font-bold">
                Select number of students
              </span>
            ) : step === 2 ? (
              <span className="text-base font-bold">Add students details</span>
            ) : step === 3 ? (
              <span className="text-base font-bold">
                Verify Primary Phone Number
              </span>
            ) : (
              <span className="text-base font-bold">Select Payment Mode</span>
            )}
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {step === 1 && (
          <Step1SelectStudents
            studentCount={studentCount}
            setStudentCount={setStudentCount}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <Step2StudentsDetails
            students={students}
            setStudents={setStudents}
            setStudentCount={setStudentCount}
            setStep={setStep}
          />
        )}
        {step === 3 && (
          <Step3ParentContact
            parentContact={parentContact}
            setParentContact={setParentContact}
            errors={phoneErrors}
            setErrors={setPhoneErrors}
          />
        )}
        {step === 4 && (
          <Step4PaymentType
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            studentCount={students.length}
          />
        )}
      </Suspense>

      {step > 1 && (
        <SummaryCard
          step={step}
          students={students}
          parentContact={parentContact}
          handleAddStudent={handleAddStudent}
          handleRemoveStudent={handleRemoveStudent}
          setStep={setStep}
        />
      )}

      {showOtpPopup && (
        <OtpVerification handleBack={onCloseOtpPopup} setOtp={() => {}} />
      )}
    </div>
  );
}
