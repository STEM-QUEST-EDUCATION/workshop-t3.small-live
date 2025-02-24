import { useEffect, useState } from "react";
import { useBooking } from "@/contexts/BookingContext";

interface TicketData {
  transactionDate: string;
  workshopTitle: string;
  studentName: string;
  age: string;
  venue: string;
  location: {
    address: string;
    city: string;
  };
  date: string;
  time: string;
  price: string;
  paymentMode: string;
  bookingId: string;
  transactionId: string;
  receiptNumber?: string;
  date_of_workshop: string;
}

export function useTicketData() {
  const { transactionId: contextTransactionId, workshopDetails } = useBooking();
  const [ticketData, setTicketData] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTicketData() {
      const urlParams = new URLSearchParams(window.location.search);
      const txnIdFromUrl = urlParams.get("txnId");
      const paymentType = urlParams.get("type"); // Get payment type from URL
      const transactionId = contextTransactionId || txnIdFromUrl || localStorage.getItem("transactionId");

      console.log("Transaction ID sources:", {
        context: contextTransactionId,
        url: txnIdFromUrl,
        localStorage: localStorage.getItem("transactionId"),
        final: transactionId,
      });

      if (!transactionId) {
        setError("No transaction ID found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tickets/${transactionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch ticket data");
        }

        const data = await response.json();
        console.log("TIcket Data: ", data, workshopDetails.location);

        if (Array.isArray(data)) {
          const updatedData = data.map((ticket) => ({
            ...ticket,
            location: ticket.location || {
              address: workshopDetails.location?.split(',')[0]?.trim() || '',
              city: workshopDetails.location?.split(',')[1]?.trim() || ''
            },
            date: workshopDetails.date,
            paymentMode: paymentType === 'offline' ? 'Pay at Centre' : 'Paid',
            date_of_workshop: ticket.date_of_workshop,
          }));
          setTicketData(updatedData);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch ticket data"
        );
      } finally {
        setIsLoading(false);
      }
    }
    console.log("DATA - ", workshopDetails)

    fetchTicketData();
  }, [contextTransactionId, workshopDetails]);

  return { ticketData, isLoading, error };
}
