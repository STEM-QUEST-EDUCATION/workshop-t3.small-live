"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "./components/Loading";
import { WorkshopDocument } from "@/models/Workshop";
import { useBooking } from "@/contexts/BookingContext";

// Dynamic imports with loading fallbacks
const BackButton = dynamic(() => import("./components/BackButton"), {
  loading: () => (
    <div className="h-10 w-10 animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

const StepIndicator = dynamic(() => import("./components/StepIndicator"), {
  loading: () => (
    <div className="h-6 w-full animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

const TimeSlotButton = dynamic(() => import("./components/TimeSlotButton"), {
  loading: () => (
    <div className="h-12 w-full animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

const WorkshopPage = dynamic(() => import("./components/WorkshopDetails"), {
  loading: () => (
    <div className="h-40 w-full animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

const Testimonials = dynamic(() => import("./components/feedbackCarousel"), {
  loading: () => (
    <div className="h-40 w-full animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

const SkillCard = dynamic(() => import("./components/SkillCard"), {
  loading: () => (
    <div className="h-20 w-full animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

const LocationCard = dynamic(() => import("./components/LocationCard"), {
  loading: () => (
    <div className="h-40 w-full animate-pulse bg-gray-200 rounded" />
  ),
  ssr: false,
});

const WorkshopDetailsSection = dynamic(
  () => import("./components/WorkshopDetailsSection"),
  {
    loading: () => (
      <div className="h-40 w-full animate-pulse bg-gray-200 rounded" />
    ),
    ssr: false,
  }
);

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

export default function Page() {
  const { setWorkshopDetails } = useBooking();
  const router = useRouter();
  const params = useParams();
  const workshopId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [workshopData, setWorkshopData] = useState<WorkshopDocument | null>(
    null
  );
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshopData = async () => {
      if (!workshopId) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/workshop/${workshopId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch workshop details");
        }

        const data: WorkshopDocument = await response.json();
        setWorkshopData(data);

        if (data?.date?.time_slots && Array.isArray(data.date.time_slots)) {
          const uniqueTimeSlots = Array.from(new Set(data.date.time_slots));
          setTimeSlots(uniqueTimeSlots);
          setSelectedTime(uniqueTimeSlots[0] || null);
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error);
        setError("Failed to load workshop details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkshopData();
  }, [workshopId]);

  const handleBookNow = () => {
    if (!selectedTime || !workshopData) {
      setError("Please select a time slot to continue");
      return;
    }

    try {
      const workshopDetails = {
        id: workshopData._id.toString(),
        name: workshopData.theme,
        date: workshopData.date_of_workshop,
        time: selectedTime,
        location: `${workshopData.location.address}, ${workshopData.location.city}`,
        price: workshopData.rate,
      };

      console.log("Logging individual fields in workshopDetails:");
      console.log("ID:", workshopDetails.id);
      console.log("Name:", workshopDetails.name);
      console.log("Date:", workshopDetails.date);
      console.log("Time:", workshopDetails.time);
      console.log("Location:", workshopDetails.location);
      console.log("Price:", workshopDetails.price);

      setWorkshopDetails(workshopDetails);
      router.push("/booking");
    } catch (error) {
      console.error("Error handling booking:", error);
      setError("Failed to process booking. Please try again.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white"
        >
          Go Back Home
        </Button>
      </div>
    );
  }

  if (!workshopData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Workshop Not Found
        </h2>
        <p className="text-gray-700 mb-4">
          The workshop you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white"
        >
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <main className="max-w-md mx-auto bg-gray-50 min-h-screen pb-5">
        <div className="relative h-[50vh] rounded-b-[2rem] overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube-nocookie.com/embed/5blxdvK5vjU?autoplay=1&loop=1&playlist=5blxdvK5vjU&controls=0&mute=1&enablejsapi=0&modestbranding=1&rel=0"
              title="Workshop Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                transform: "scale(1.05)",
                transformOrigin: "center",
              }}
            ></iframe>
          </div>
          <BackButton />
          <div className="absolute bottom-7 left-0 right-0 transform translate-y-[10%] px-4">
            <WorkshopPage
              title={workshopData.theme}
              date_of_workshop={workshopData.date_of_workshop}
              location={workshopData.location}
              price={`${workshopData.rate} INR`}
              rating={workshopData.rating}
              duration={workshopData.duration}
              imageUrl="/placeholder.svg"
              shareImage="/images/share-image.jpg"
            />
          </div>
        </div>

        <div className="flex flex-col min-h-screen bg-gray-50">
          <main className="flex-1 p-5">
            <StepIndicator step={2} title="Pick up your workshop slot" />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {timeSlots.map((time) => (
                <TimeSlotButton
                  key={`${workshopData._id}-${time}`}
                  time={time}
                  selectedTime={selectedTime || ""}
                  onClick={setSelectedTime}
                />
              ))}
            </div>
            <WorkshopDetailsSection
              description={
                Array.isArray(workshopData.description)
                  ? workshopData.description
                  : []
              }
            />
            <Testimonials />
            <SkillCard skills={skills} />
            <LocationCard locationImages={locationImages} />
          </main>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t mx-auto max-w-md">
            <div className="flex gap-3">
              <Button
                className="w-full bg-[#09A5E8] text-white hover:bg-[#0787be]"
                onClick={handleBookNow}
                disabled={!selectedTime}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
