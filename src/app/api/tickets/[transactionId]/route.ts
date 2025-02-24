import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BookingModel } from "@/models/Booking";
import { format } from "date-fns";

interface Child {
  childname: string;
  age: number;
  _id?: string;
}

interface BookingDocument {
  _id: unknown;
  __v: number;
  child: Array<Child>;
  created_at: Date;
  payment: {
    product_info: string;
    amount: number;
    mode: string;
    reference_id: string;
    Transaction_ID: string;
    gateway: string;
    status: "initiated" | "completed" | "cancelled" | "bounced";
    hash_key: string | null;
    access_key: string | null;
    surl: string | null;
    furl: string | null;
    agent_code: string | null;
    updated_by: string | null;
    offline_details: {
      method: "pay_at_center";
      receipt_no: string;
      date: Date;
    } | null;
  };
  center_code: string;
  time: string;
  workshop_location?: string;
  date_of_workshop: Date;
  [key: string]: unknown; // For any additional fields
}

export interface TicketData {
  transactionDate: string;
  workshopTitle: string;
  studentName: string;
  age: string;
  location: {
    address: string;
    city: string;
  };
  date: string;
  time: string;
  price: string;
  paymentMode: string;
  transactionId: string;
  receiptNumber?: string;
  date_of_workshop: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ transactionId: string }> }
) {
  try {
    await connectDB();

    const { transactionId } = await context.params;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const booking = (await BookingModel.findOne({
      "payment.Transaction_ID": transactionId,
    }).lean()) as BookingDocument | null;

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Transform the data for ticket display
    const ticketData = booking.child.map((child: Child) => ({
      transactionDate: format(new Date(booking.created_at), "dd MMM"),
      workshopTitle: booking.payment.product_info,
      studentName: child.childname,
      age: `${child.age} yrs`,
      location: {
        address: booking.workshop_location?.split(',')[0]?.trim() || '',
        city: booking.workshop_location?.split(',')[1]?.trim() || ''
      },
      date: format(new Date(booking.created_at), "dd MMM yyyy"),
      time: booking.time,
      price: `₹${booking.payment.amount}`,
      paymentMode: booking.payment.mode === "DC" ? "Paid" : "Pay at Centre",
      transactionId: booking.payment.Transaction_ID,
      receiptNumber: booking.payment.offline_details?.receipt_no,
      date_of_workshop: booking.date_of_workshop,
    }));

    return NextResponse.json(ticketData);
  } catch (error) {
    console.error("Error fetching ticket data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
