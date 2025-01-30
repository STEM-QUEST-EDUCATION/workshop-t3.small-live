'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BookingFormData } from '@/lib/schemas/booking';

interface Workshop {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  price: number;
}



interface BookingContextType {
  bookingData: BookingFormData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  workshopDetails: Workshop;
  setWorkshopDetails: React.Dispatch<React.SetStateAction<Workshop>>;
  orderTotal: number;
  setOrderTotal: React.Dispatch<React.SetStateAction<number>>;
  transactionId: string | null;
  setTransactionId: React.Dispatch<React.SetStateAction<string | null>>;
  parentPhone: string;
  setParentPhone: React.Dispatch<React.SetStateAction<string>>;
  ticketPrice: number;
  setTicketPrice: React.Dispatch<React.SetStateAction<number>>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingFormData>(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('bookingData');
      const initialData = storedData
        ? (JSON.parse(storedData) as BookingFormData)
        : {
            workshop: { id: '', name: '', date: '', price: 0 },
            children: [],
            parent: { name: '', email: '', phone1: '', phone2: '', address: '' },
            payment: { method: 'online', status: 'pending', transactionId: null },
          };
      console.log('Initial bookingData:', initialData);
      return initialData;
    }
    return {
      workshop: { id: '', name: '', date: '', price: 0 },
      children: [],
      parent: { name: '', email: '', phone1: '', phone2: '', address: '' },
      payment: { method: 'online', status: 'pending', transactionId: null },
    };
  });

  const [workshopDetails, setWorkshopDetails] = useState<Workshop>({
    id: '', 
    name: '',
    date: '', 
    time: '', 
    location: '', 
    price: 0, 
  });

  const [orderTotal, setOrderTotal] = useState(0);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [parentPhone, setParentPhone] = useState<string>('');
  const [ticketPrice, setTicketPrice] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      setOrderTotal(workshopDetails.price * bookingData.children.length);
    };

    calculateTotal();
  }, [workshopDetails.price, bookingData.children.length]);

  useEffect(() => {
    const newTicketPrice = workshopDetails.price * bookingData.children.length;
    setTicketPrice(newTicketPrice);
  }, [workshopDetails.price, bookingData.children.length]);

  useEffect(() => {
    console.log('Booking data updated:', bookingData);
    console.log('Children data:', bookingData.children);
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
  }, [bookingData]);

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        workshopDetails,
        setWorkshopDetails,
        orderTotal,
        setOrderTotal,
        transactionId,
        setTransactionId,
        parentPhone,
        setParentPhone,
        ticketPrice,
        setTicketPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
