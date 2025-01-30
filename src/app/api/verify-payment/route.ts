// api/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { BookingModel } from "@/models/Booking";

interface EasebuzzParams {
  txnid: string;
  amount: string;
  email: string;
  phone: string;
}

class EasebuzzVerification {
  private readonly key: string;
  private readonly salt: string;

  constructor(key: string, salt: string) {
    this.key = key;
    this.salt = salt;
  }

  private formatAmount(amount: string): string {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      throw new Error("Invalid amount format");
    }
    return numericAmount % 1 === 0
      ? `${numericAmount.toFixed(1)}`
      : `${numericAmount.toFixed(2)}`;
  }

  private generateHash(params: EasebuzzParams): string {
    const strParams = {
      key: String(this.key).trim(),
      txnid: String(params.txnid).trim(),
      amount: this.formatAmount(params.amount),
      email: String(params.email).trim(),
      phone: String(params.phone).trim(),
      salt: String(this.salt).trim(),
    };

    const hashSequence = [
      strParams.key,
      strParams.txnid,
      strParams.amount,
      strParams.email,
      strParams.phone,
      strParams.salt,
    ];

    const hashString = hashSequence.join('|');
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return hash;
  }

  async verifyTransaction(params: EasebuzzParams) {
    const formattedAmount = this.formatAmount(params.amount);
    const hash = this.generateHash({ ...params, amount: formattedAmount });

    const formData = new URLSearchParams({
      key: this.key,
      txnid: params.txnid,
      amount: formattedAmount,
      email: params.email,
      phone: params.phone,
      hash: hash,
    });

    try {
      const response = await fetch(
        'https://testdashboard.easebuzz.in/transaction/v1/retrieve',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log('Easebuzz Response:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const key = process.env.EASEBUZZ_KEY;
    const salt = process.env.EASEBUZZ_SALT;

    if (!key || !salt) {
      throw new Error('Missing Easebuzz credentials');
    }

    const body = await req.json();

    if (!body.response) {
      return NextResponse.json(
        { message: 'Missing response data' },
        { status: 400 }
      );
    }

    const params: EasebuzzParams = {
      txnid: body.response.txnid,
      amount: body.response.amount,
      email: body.response.email,
      phone: body.response.phone,
    };

    for (const [key, value] of Object.entries(params)) {
      if (!value) {
        return NextResponse.json(
          { message: `Missing required parameter: ${key}` },
          { status: 400 }
        );
      }
    }

    const verifier = new EasebuzzVerification(key, salt);
    const easebuzzResponse = await verifier.verifyTransaction(params);

    if (easebuzzResponse.status === true && easebuzzResponse.msg.status === 'success') {
      const transactionId = easebuzzResponse.msg.txnid;

      await connectDB();

      const booking = await BookingModel.findOne({ 'payment.Transaction_ID': transactionId });

      if (!booking) {
        return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
      }

      const updateFields = {
        $set: {
          'payment.gateway': easebuzzResponse.msg.payment_source || 'easebuzz',
          'payment.mode': easebuzzResponse.msg.mode || 'online',
          'payment.status': 'completed',
          'payment.reference_id': easebuzzResponse.msg.easepayid,
          'payment.hash_key': easebuzzResponse.msg.hash,
          'payment.surl': easebuzzResponse.msg.surl || null,
          'payment.furl': easebuzzResponse.msg.furl || null,
          'merchant.name': easebuzzResponse.msg.name_on_card,
          'merchant.transaction_id': easebuzzResponse.msg.easepayid,
          'otp_verified': true,
          'status': 'completed',
          'updated_at': new Date()
        }
      };

      console.log("Update fields:", updateFields);

      const updatedBooking = await BookingModel.findByIdAndUpdate(
        booking._id,
        updateFields,
        { new: true, runValidators: true }
      );

      if (!updatedBooking) {
        return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
      }

      console.log('Updated Booking:', updatedBooking);

      return NextResponse.json({ success: true, message: 'Payment verified and booking updated' });
    } else {
      return NextResponse.json({ success: false, message: easebuzzResponse.msg.error_Message }, { status: 400 });
    }
  } catch (error) {
    console.error('Handler Error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
