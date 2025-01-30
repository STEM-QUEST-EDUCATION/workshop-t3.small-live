import mongoose, { Schema, Document } from "mongoose";

// Define the Booking interface
interface Booking {
  workshop_id: string;
  child: Array<{
    childname: string;
    age: number;
  }>;
  ph_number: string;
  otp_verified: boolean;
  time: string;
  payment: {
    Transaction_ID: string; // This will be the UUID
    gateway: string;
    mode: string;
    status: "initiated" | "completed" | "cancelled" | "bounced";
    product_info: string;
    reference_id: string;
    hash_key: string | null;
    amount: number;
    access_key: string | null;
    surl: string | null;
    furl: string | null;
    agent_code: string | null;
    updated_by: string | null;
    offline_details: {
      method: "pay_at_center" | null;
      receipt_no: string;
      date: Date;
    } | null;
  };
  center_code: string;
  status: "completed" | "pending" | "cancelled";
  created_at: Date;
  updated_at: Date;
  merchant: {
    name: string | null;
    transaction_id: string | null;
  };
}

// Define the Booking document interface extending Document
export interface BookingDocument extends Document, Booking {}

const bookingSchema = new Schema<BookingDocument>({
  workshop_id: { type: String, required: true },
  child: [
    {
      childname: { type: String, required: true },
      age: { type: Number, required: true },
    },
  ],
  ph_number: { type: String, required: true },
  otp_verified: { type: Boolean, required: true },
  time: { type: String, required: true },
  payment: {
    Transaction_ID: { type: String, required: true, unique: true }, // UUID for transaction id
    gateway: { type: String },
    mode: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["initiated", "completed", "cancelled", "bounced"],
    },
    product_info: { type: String, required: true },
    reference_id: { type: String, required: true },
    hash_key: { type: String },
    amount: { type: Number, required: true },
    access_key: { type: String, default: null },
    surl: { type: String, default: null },
    furl: { type: String, default: null },
    agent_code: { type: String, default: null },
    updated_by: { type: String, default: null },
    offline_details: {
      method: String,
      receipt_no: String,
      date: Date,
    },
  },
  center_code: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["completed", "pending", "cancelled"],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  merchant: {
    name: { type: String, default: null },
    transaction_id: { type: String, default: null },
  },
});

// Create or use the existing model
export const BookingModel =
  mongoose.models.Booking ||
  mongoose.model<BookingDocument>("Booking", bookingSchema);
