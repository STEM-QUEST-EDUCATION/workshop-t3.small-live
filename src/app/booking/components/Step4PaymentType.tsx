import { Dispatch, SetStateAction, useEffect } from 'react';
import { Zap, Clock, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBooking } from '@/contexts/BookingContext';

// Helper function to format the date
function formatWorkshopDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  const formattedDate = new Date(date).toLocaleDateString('en-US', options);
  return formattedDate;
}

interface Step4Props {
  paymentType: 'now' | 'later' | null;
  setPaymentType: Dispatch<SetStateAction<'now' | 'later' | null>>;
  studentCount: number;
}

export default function Step4PaymentType({ paymentType, setPaymentType, studentCount }: Step4Props) {
  const { 
    workshopDetails, 
    setBookingData, 
    setTicketPrice 
  } = useBooking();

  useEffect(() => {
    if (paymentType === null) {
      setPaymentType('now');
    }
  }, [paymentType, setPaymentType]);

  useEffect(() => {
    setBookingData((prevData) => ({
      ...prevData,
      payment: {
        ...prevData.payment,
        method: paymentType === 'now' ? 'online' : 'offline',
      },
    }));
  }, [paymentType, setBookingData]);

  useEffect(() => {
    const newTicketPrice = workshopDetails.price * studentCount;
    setTicketPrice(newTicketPrice);
  }, [studentCount, workshopDetails.price, setTicketPrice]);

  
  const totalGSTAmount = (workshopDetails.price * studentCount*0.18); 
  const totalTicketPrice = (workshopDetails.price * studentCount)-totalGSTAmount;
  const convenienceFees = 0; 
  const finalOrderTotal = totalTicketPrice + totalGSTAmount + convenienceFees;

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{workshopDetails.name}</h3>
            <p className="text-gray-600 text-sm">Date: {formatWorkshopDate(workshopDetails.date)}</p>
            <p className="text-gray-600 text-sm">Time: {workshopDetails.time}</p>
            <p className="text-gray-600 text-sm">Location: {workshopDetails.location}</p>
          </div>
          <div className="flex flex-col items-center bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
            <span>G-{studentCount}</span>
            <span>Ticket{studentCount > 1 ? 's' : ''}</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Ticket(s) price x{studentCount}</span>
          <span className="font-semibold">₹{totalTicketPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">GST (18%)</span>
          <span className="font-semibold">₹{totalGSTAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Convenience fees</span>
          <span className="font-semibold">₹{convenienceFees.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="font-semibold">Order total</span>
          <span className="font-semibold">₹{finalOrderTotal.toFixed(2)}</span>
        </div>
      </Card>

      <div className="mt-8">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={paymentType === 'now' ? 'default' : 'outline'}
            className={`h-20 relative rounded-lg ${
              paymentType === 'now' 
              ? 'bg-[#00A0E4] hover:bg-[#0090D4]' 
              : 'border-2 hover:bg-gray-50'
            }`}
            onClick={() => setPaymentType('now')}
          >
            <div className="flex flex-col items-center gap-2">
              <Zap className={`h-5 w-5 ${paymentType === 'now' ? 'text-white' : 'text-gray-600'}`} />
              <span className={paymentType === 'now' ? 'text-white' : 'text-gray-600'}>Pay now</span>
            </div>
            {paymentType === 'now' && (
              <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-white" />
            )}
          </Button>
          <Button
            variant={paymentType === 'later' ? 'default' : 'outline'}
            className={`h-20 relative rounded-lg ${
              paymentType === 'later' 
              ? 'bg-[#00A0E4] hover:bg-[#0090D4]' 
              : 'border-2 hover:bg-gray-50'
            }`}
            onClick={() => setPaymentType('later')}
          >
            <div className="flex flex-col items-center gap-2">
              <Clock className={`h-5 w-5 ${paymentType === 'later' ? 'text-white' : 'text-gray-600'}`} />
              <span className={paymentType === 'later' ? 'text-white' : 'text-gray-600'}>Pay At Center</span>
            </div>
            {paymentType === 'later' && (
              <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
