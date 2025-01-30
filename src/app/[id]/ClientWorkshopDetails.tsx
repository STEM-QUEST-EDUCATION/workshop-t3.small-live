// app/[id]/ClientWorkshopDetails.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BackButton from "./components/BackButton";
import StepIndicator from "./components/StepIndicator";
import TimeSlotButton from "./components/TimeSlotButton";
import Loading from "./components/Loading";
import { WorkshopDocument } from "@/models/Workshop";
import { useBooking } from "@/contexts/BookingContext";
import WorkshopPage from "./components/WorkshopDetails";
import Testimonials from "./components/feedbackCarousel";
import SkillCard from "./components/SkillCard";
import LocationCard from "./components/LocationCard";
import WorkshopDetailsSection from "./components/WorkshopDetailsSection";
import ErrorBoundary from "./components/ErrorBoundary";
import { parse, differenceInHours } from 'date-fns';

interface ClientWorkshopDetailsProps {
  initialData: WorkshopDocument | null;
}

export default function ClientWorkshopDetails({
  initialData,
}: ClientWorkshopDetailsProps) {
  const { setWorkshopDetails } = useBooking();
  const router = useRouter();

  const [workshopData, setWorkshopData] = useState<WorkshopDocument | null>(
    null
  );
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && initialData.date && initialData.date.time_slots) {
      setWorkshopData(initialData);
      setTimeSlots(Array.from(new Set(initialData.date.time_slots)));
      setSelectedTime(initialData.date.time_slots[0] || null);
    }
  }, [initialData]);

  const handleBookNow = () => {
    if (!selectedTime || !workshopData) {
      return;
    }

    const workshopDetails = {
      id: workshopData._id?.toString() || "",
      name: workshopData.theme || "",
      date: workshopData.date_of_workshop || "",
      time: selectedTime,
      location: `${workshopData.location.address}, ${workshopData.location.city}`,
      price: workshopData.rate || 0,
    };

    if (workshopDetails) {
      setWorkshopDetails(workshopDetails);
      router.push("/booking");
    }
  };

  const calculateDuration = (timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split(" - ");
    const startDate = parse(startTime, "hh:mm a", new Date());
    const endDate = parse(endTime, "hh:mm a", new Date());
    return differenceInHours(endDate, startDate);
  };

  if (!workshopData) {
    return <Loading />;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <main className="max-w-md mx-auto bg-gray-50 min-h-screen pb-5">
        <div className="relative h-[50vh] rounded-b-[2rem] overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/jPG5PIdXCXQ?autoplay=1&loop=1&playlist=jPG5PIdXCXQ&controls=0&mute=1"
              title="Workshop Video"
              allow="autoplay; encrypted-media"
              loading="lazy"
              style={{ transform: "scale(1.1)", transformOrigin: "center" }}
            />
          </div>
          <BackButton />
          <div className="absolute bottom-7 left-0 right-0 transform translate-y-[10%] px-4">
            <WorkshopPage
              title={workshopData.theme}
              date_of_workshop={workshopData.date_of_workshop}
              location={workshopData.location}
              price={`${workshopData.rate} INR`}
              rating={workshopData.rating}
              duration={calculateDuration(workshopData.date.time_slots[0])}
              imageUrl="/placeholder.svg"
              shareImage="/images/share-image.jpg"
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
            <WorkshopDetailsSection
              description={workshopData.description}
            />
            <Testimonials />
            <SkillCard 
              skills={[
                "Creativity",
                "Critical Thinking",
                "Collaboration",
                "Leadership",
                "Problem Solving",
                "Adaptability"
              ]} 
            />
            <LocationCard 
              locationImages={[
                "/workshop-photos/workshop-photo-1.webp",
                "/workshop-photos/workshop-photo-2.webp"
              ]} 
            />
          </main>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t mx-auto max-w-md">
            <Button
              className="w-full bg-[#09A5E8] text-white hover:bg-[#0787be]"
              onClick={handleBookNow}
              disabled={!selectedTime}
            >
              Book Now
            </Button>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}