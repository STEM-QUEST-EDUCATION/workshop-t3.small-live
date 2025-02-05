import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BookingClosedMessageProps {
  message: string;
}

export default function BookingClosedMessage({
  message,
}: BookingClosedMessageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Bookings Closed
      </h2>
      <p className="text-gray-700 mb-4">{message}</p>
      <Button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white"
      >
        Go Back Home
      </Button>
    </div>
  );
}
