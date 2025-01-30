'use client';

import { useSearchParams } from 'next/navigation';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  return (
    <div >
    
      
      {status === 'success' && (
        <>
        <PaymentSuccess />
        </>
      )}

      {status === 'failed' && (
        <>
          <PaymentFailed error="Payment failed due to an unknown error." />
        </>
      )}

      {!status && (
        <div className="text-gray-600">
          <p>Verifying payment status...</p>
        </div>
      )}
    </div>
  );
}