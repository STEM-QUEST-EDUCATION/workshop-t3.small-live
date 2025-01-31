import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'; 

// Get environment variables
const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY;
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT;

interface PaymentRequest {
  workshop_id: string;
  transactionId: string; 
  amount: number;
  product_info: string;
  firstname: string;
  phone: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestData: PaymentRequest = await request.json();
    const { 
     
      transactionId, 
      amount, 
      product_info, 
      firstname, 
      phone, 
      email 
    } = requestData;

    console.log("Request data for Easebuzz:", requestData);

    // Construct the hash string
    const amountString = amount.toFixed(2); // Convert amount to string with 2 decimal places
    const hashString = `${EASEBUZZ_KEY}|${transactionId}|${amountString}|${product_info}|${firstname}|${email}|||||||||||${EASEBUZZ_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    // Prepare data for Easebuzz request
    const easebuzzData = {
      key: EASEBUZZ_KEY,
      txnid: transactionId,
      amount: amountString,
      productinfo: product_info,
      firstname,
      phone, 
      email,
      surl: `${request.headers.get('origin')}/booking`, 
      furl: `${request.headers.get('origin')}/booking`, 
      hash,
    };

    console.log("Data sent to Easebuzz:", easebuzzData);
    console.log(hashString)

    // Make the request to Easebuzz
    const easebuzzResponse = await fetch('https://pay.easebuzz.in/payment/initiateLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(easebuzzData as Record<string, string>), 
    });

    console.log("urlsearch Params",new URLSearchParams(easebuzzData as Record<string, string>))
    const responseData = await easebuzzResponse.json();
    console.log("Easebuzz response:", responseData);

    if (easebuzzResponse.ok) {
      return NextResponse.json({ 
        success: true, 
        paymentUrl: responseData.data,
        access_key: responseData.access_key, // Include access_key in the response
      }); 
    } else {
      return NextResponse.json({ 
        success: false, 
        message: responseData.error_Message || 'Failed to initiate payment' 
      });
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
