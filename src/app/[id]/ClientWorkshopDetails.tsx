// app/[id]/ClientWorkshopDetails.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StepIndicator from "./components/StepIndicator";
import TimeSlotButton from "./components/TimeSlotButton";
import Loading from "./components/Loading";
import { WorkshopDocument } from "@/models/Workshop";
import { useBooking } from "@/contexts/BookingContext";
import Testimonials from "./components/feedbackCarousel";
import SkillCard from "./components/SkillCard";
import LocationCard from "./components/LocationCard";
import WorkshopDetailsSection from "./components/WorkshopDetailsSection";
import ErrorBoundary from "./components/ErrorBoundary";
import { parse, differenceInHours } from "date-fns";
import BookingClosedMessage from "./components/BookingClosedMessage";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import { app } from "@/lib/firebaseConfig"; // Adjust the import path based on your project structure

// Dynamic imports with loading fallbacks
const BackButtonDynamic = dynamic(() => import("./components/BackButton"), {
  loading: () => (
    <div className="h-10 w-10 animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

// Dynamically import WorkshopDetails with ssr disabled
const WorkshopDetails = dynamic(() => import("./components/WorkshopDetails"), {
  ssr: false,
});

const Footerpage = dynamic(() => import("@/components/ui/Footerpage"), {
  ssr: false,
});

interface ClientWorkshopDetailsProps {
  initialData: WorkshopDocument;
}

export default function ClientWorkshopDetails({
  initialData,
}: ClientWorkshopDetailsProps) {
  const { setWorkshopDetails } = useBooking();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const [workshopData] = useState<WorkshopDocument>(initialData);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClosedMessage, setShowClosedMessage] = useState(false);
  const [mounted, setMounted] = useState(false);

  const theme = initialData.theme;

  useEffect(() => {
    if (initialData && initialData.date && initialData.date.time_slots) {
      const slots = Array.from(new Set(initialData.date.time_slots));
      setTimeSlots(slots);

      // Check if all time slots are in the past
      const now = new Date();
      const allSlotsInPast = slots.every((slot) => {
        const [startTime] = slot.split(" - ");
        const slotDate = parse(
          `${initialData.date_of_workshop} ${startTime}`,
          "yyyy-MM-dd hh:mm a",
          new Date()
        );
        return slotDate < now;
      });

      setShowClosedMessage(allSlotsInPast);
      if (!allSlotsInPast) {
        setSelectedTime(slots[0] || null);
      }
    }
  }, [initialData]);

  useEffect(() => {
    setMounted(true);
    // Only initialize analytics on the client side
    if (typeof window !== "undefined") {
      setAnalytics(getAnalytics(app));
    }
  }, []);

  const handleBookNow = async () => {
    if (!selectedTime || !workshopData) {
      return;
    }

    setIsLoading(true);
    try {
      const workshopDetails = {
        id: workshopData._id?.toString() || "",
        name: theme || "",
        date: workshopData.date_of_workshop || "",
        time: selectedTime,
        location: `${workshopData.location.address}, ${workshopData.location.city}`,
        price: workshopData.rate || 0,
      };

      setWorkshopDetails(workshopDetails);
      if (analytics) {
        logEvent(analytics, "book_now_clicked", { workshop_name: theme });
      }
      router.push("/booking");
    } catch (error) {
      console.error("Booking error:", error);
      setError("Failed to process booking");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = (timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split(" - ");
    const startDate = parse(startTime, "hh:mm a", new Date());
    const endDate = parse(endTime, "hh:mm a", new Date());
    return differenceInHours(endDate, startDate);
  };

  if (!mounted) {
    return null;
  }

  if (!workshopData) {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <main className="max-w-md mx-auto bg-gray-50 min-h-screen pb-5">
        <div className="relative h-[50vh] rounded-b-[2rem] overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={workshopData.workshop_url}
              allow="autoplay; encrypted-media"
              loading="lazy"
              style={{ transform: "scale(1.1)", transformOrigin: "center" }}
            />
          </div>
          <BackButtonDynamic />
          <div className="absolute bottom-7 left-0 right-0 transform translate-y-[10%] px-4">
            <WorkshopDetails
              title={workshopData.theme}
              date_of_workshop={workshopData.date_of_workshop}
              location={workshopData.location}
              price={`${workshopData.rate} INR`}
              rating={workshopData.rating}
              duration={calculateDuration(workshopData.date.time_slots[0])}
              imageUrl="/placeholder.svg"
              shareImage="/images/share-image.jpg"
              theme={workshopData.theme}
            />
          </div>
        </div>

        <div className="flex flex-col min-h-screen bg-gray-50">
          <main className="flex-1 p-5">
            <StepIndicator step={2} title="Pick your workshop slot" />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {timeSlots.map((time) => (
                <TimeSlotButton
                  key={`${workshopData._id}-${time}`}
                  time={time}
                  selectedTime={selectedTime || ""}
                  onClick={(time) => setSelectedTime(time)}
                />
              ))}
            </div>
            <WorkshopDetailsSection description={workshopData.description} />
            <Testimonials />
            <SkillCard skills={skills} />
            <LocationCard locationImages={locationImages} />
          </main>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t mx-auto max-w-md">
            {showClosedMessage ? (
              <BookingClosedMessage />
            ) : (
              <Button
                className="w-full bg-[#09A5E8] text-white hover:bg-[#0787be]"
                onClick={handleBookNow}
                disabled={!selectedTime || isLoading}
              >
                {isLoading ? "Processing..." : "Book Now"}
              </Button>
            )}
          </div>
        </div>
        <Footerpage />
      </main>
    </ErrorBoundary>
  );
}

// Move the skills and locationImages arrays here as well
const skills = [
  "Creativity",
  "Critical Thinking",
  "Collaboration",
  "Leadership",
  "Problem Solving",
  "Adaptability",
];

const locationImages = [
  "/workshop-photos/workshop-photo-1.webp",
  "/workshop-photos/workshop-photo-2.webp",
  "/workshop-photos/workshop-photo-3.webp",
  "/workshop-photos/workshop-photo-4.webp",
  "/workshop-photos/workshop-photo-5.webp",
  "/workshop-photos/workshop-photo-6.webp",
];
