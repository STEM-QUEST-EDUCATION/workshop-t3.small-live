import Image from "next/image";

interface PaymentFailedProps {
  error: string | null;
  description?: string;
}

export default function PaymentFailed({
  error,
  description = "Your payment could not be processed. Please try again."
}: PaymentFailedProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-10">
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="w-36 h-36 mb-8">
          <Image src="/icons/failed.svg" width={20} height={20} alt="Failed" className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-medium text-black mb-2">Payment Failed</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* Display the error message if available */}
        <p className="text-sm font-medium text-black mb-12 text-center px-4">
          {description}
        </p>
      </div>
      <div className="flex flex-col space-y-4 mb-44">
        <button className="bg-[#29A7FF] text-white text-sm font-medium py-3 px-20 rounded-lg w-[351px] h-[52px]">
          Try Again
        </button>
        <button className="bg-[#A7D1FF] text-white text-sm font-medium py-3 px-20 rounded-lg w-[351px] h-[52px]">
          Back to Home
        </button>
      </div>
    </div>
  );
}
