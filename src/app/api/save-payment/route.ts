import { connectDB } from "@/lib/mongodb";
import { BookingModel } from "@/models/Booking";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

// Define the interface for incoming request data
interface PaymentRequest {
  workshop_id: string;
  children: { childname: string; age: number }[];
  ph_number: string;
  orderTotal: number; 
  product_info: string; 
  time: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log("MongoDB connected successfully.");

    const requestData: PaymentRequest = await request.json();
    console.log("Incoming request data:", requestData); 

    const { workshop_id, children, ph_number, orderTotal, product_info, time } = requestData; // Access orderTotal and product_info 
    console.log("workshop_id:", workshop_id, "children:", children, "ph_number:", ph_number, "orderTotal:",orderTotal, "time:",time);

    const uniqueId = uuidv4();
    console.log("Generated Transaction ID:", uniqueId);

    const newPaymentInfo = {
      workshop_id: workshop_id,
      child: children, // Now using `children` from the request data
      ph_number: ph_number,
      otp_verified: false,
      time : time,
      payment: {
        Transaction_ID: uniqueId,
        gateway: null,
        mode: "online",
        status: "initiated",
        product_info: product_info,
        reference_id: "REF_" + uniqueId,
        hash_key: null,
        amount: orderTotal, // Replace with calculated amount
        access_key: null,
        surl: null,
        furl: null,
        agent_code: null,
        updated_by: null,
        offline_details: null,
      },
      center_code: "GLINDNOICE01",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      merchant: {
        name: null,
        transaction_id: null,
      },
    };

    console.log("Constructed payment info object:", newPaymentInfo);

    const savedPayment = await BookingModel.create(newPaymentInfo);
    console.log("Payment info saved successfully:", savedPayment);

    return NextResponse.json({ success: true, paymentId: uniqueId });
  } catch (error) {
    console.error("Error saving payment info:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save payment info" },
      { status: 500 }
    );
  }
}
