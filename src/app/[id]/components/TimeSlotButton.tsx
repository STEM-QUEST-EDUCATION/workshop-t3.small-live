"use client";

import { Button } from "@/components/ui/button";
import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from "@/lib/firebaseConfig"; // Adjust the import path based on your project structure

interface TimeSlotButtonProps {
  time: string;
  selectedTime: string | null;
  onClick: (time: string) => void;
}

const TimeSlotButton = ({
  time,
  selectedTime,
  onClick,
}: TimeSlotButtonProps) => {
  const analytics = getAnalytics(app);

  const handleClick = (time: string) => {
    logEvent(analytics, "time_slot_clicked", { time });
    onClick(time);
  };

  return (
    <Button
      variant={selectedTime === time ? "default" : "outline"} 
      className={`w-full py-6 relative rounded-lg text-sm font-semibold custom-font ${
        selectedTime === time
          ? "bg-[#00A6ED] hover:bg-[#00A6ED] text-white"
          : "border-[#E5E7EB] bg-white hover:bg-white text-gray-600"
      }`}
      onClick={() => handleClick(time)}
    >
      {time}
      {selectedTime === time && (
        <div className="absolute top-2 right-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="white" />
            <path
              d="M16.6667 8L10.3333 14.3333L7 11"
              stroke="#09A5E8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </Button>
  );
};

export default TimeSlotButton;
