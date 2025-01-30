import { useEffect, useState } from "react";
import { useBooking } from "@/contexts/BookingContext";

interface TicketData {
  transactionDate: string;
  workshopTitle: string;
  studentName: string;
  age: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  price: string;
  paymentMode: string;
  bookingId: string;
  transactionId: string;
  receiptNumber?: string;
}

export function useTicketData() {
  const { transactionId: contextTransactionId, workshopDetails } = useBooking();
  const [ticketData, setTicketData] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTicketData() {
      // Check multiple sources for transaction ID
      const urlParams = new URLSearchParams(window.location.search);
      const txnIdFromUrl = urlParams.get("txnId");
      const transactionId =
        contextTransactionId ||
        txnIdFromUrl ||
        localStorage.getItem("transactionId");

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
            location: workshopDetails.location || ticket.location,
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

    fetchTicketData();
  }, [contextTransactionId, workshopDetails.location]);

  return { ticketData, isLoading, error };
}
