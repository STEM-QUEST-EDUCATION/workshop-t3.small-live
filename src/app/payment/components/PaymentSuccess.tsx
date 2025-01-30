/* workshops/src/app/payment/components/PaymentSuccess.tsx */
'use client';
import { useState, useEffect } from 'react';
import { useHeaderContext } from '../context/header-context';
import TicketDetails from './TicketDetails';
import Image from 'next/image';
import TicketGenerating from './TicketGenerating';

export default function PaymentSuccess() {
  const [showTickets, setShowTickets] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const { setHeaderTitle } = useHeaderContext();
  const numberOfStudents = 3;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setHeaderTitle("Tickets Detail");
      setShowTickets(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setHeaderTitle]);

  const handleViewTickets = () => {
    setHeaderTitle("Tickets Detail");
    setShowTickets(true);
  };

  const handleBack = () => {
    setHeaderTitle("Payment Verification");
    setShowTickets(false);
  };

  if (isGenerating) {
    return <TicketGenerating />;
  }

  if (showTickets) {
    return <TicketDetails onBack={handleBack} numberOfStudents={numberOfStudents} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-36 h-36 mb-8">
            <Image src="/icons/sucess.svg" alt="Success" width={144} height={144} />
          </div>
          <h2 className="text-2xl font-medium text-black mb-2">Payment Successful</h2>
          <p className="text-sm font-medium text-black mb-12 text-center">
            You can check your ticket in the View Tickets
          </p>
          <button 
            onClick={handleViewTickets}
            className="bg-[#29A7FF] text-white text-sm font-medium py-3 px-20 rounded-lg w-[351px] h-[52px]"
          >
            View Tickets
          </button>
        </div>
      </div>
    </div>
  );
}