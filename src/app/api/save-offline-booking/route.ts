import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { BookingModel } from "@/models/Booking";
import { connectDB } from "@/lib/mongodb";

interface Child {
  name: string;
  age: string;
}

function generateReceiptNumber(): string {
  const randomNum = Math.floor(1000000 + Math.random() * 9000000);
  return `GL${randomNum}`;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { workshopDetails, bookingData, parentPhone, orderTotal } = data;

    const transactionId = uuidv4();
    const receiptNumber = generateReceiptNumber();

    const bookingDocument = {
      workshop_id: workshopDetails.id,
      child: bookingData.children.map((child: Child) => ({
        childname: child.name,
        age: parseInt(child.age, 10),
      })),
      ph_number: parentPhone,
      otp_verified: true,
      time: workshopDetails.time,
      payment: {
        Transaction_ID: transactionId,
        mode: "offline",
        status: "initiated",
        product_info: workshopDetails.name,
        reference_id: receiptNumber,
        amount: orderTotal,
        gateway: "offline",
        offline_details: {
          method: "pay_at_center",
          receipt_no: receiptNumber,
          date: new Date(),
        },
      },
      center_code: workshopDetails.location || "CENTER001",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const booking = await BookingModel.create(bookingDocument);

    return NextResponse.json({
      success: true,
      message: "Offline booking saved successfully",
      bookingId: booking._id,
      transactionId: transactionId,
      receiptNumber: receiptNumber,
    });
  } catch (error) {
    console.error("Error saving offline booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save offline booking" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { transactionId } = await request.json();

    const receiptNumber = generateReceiptNumber();

    const updatedBooking = await BookingModel.findOneAndUpdate(
      { "payment.Transaction_ID": transactionId },
      {
        $set: {
          "payment.mode": "offline",
          "payment.reference_id": receiptNumber,
          "payment.gateway": "offline",
          "payment.offline_details": {
            method: "pay_at_center",
            receipt_no: receiptNumber,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Offline booking updated successfully",
      transactionId,
      receiptNumber,
    });
  } catch (error) {
    console.error("Error updating offline booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update offline booking" },
      { status: 500 }
    );
  }
}
