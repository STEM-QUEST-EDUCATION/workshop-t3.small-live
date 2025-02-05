"use client";

import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { WorkshopCard } from "@/components/workshop-card";
import WinnerCard from "@/components/WinnerCard";
import WorkshopDatePicker from "@/components/workshop-date-picker";
import Footer from "@/components/ui/footer";
import LoadingAnimation from "@/components/ui/loading-animation";
// import { analytics } from "@/lib/firebaseConfig";
// import { logEvent } from "firebase/analytics";
import "@/styles/fonts";

interface Workshop {
  _id: string; // Unique identifier for the workshop
  theme: string;
  date_of_workshop: string;
  duration: number;
  rate: number;
  video_url: string;
  description: string;
  // location: string;
  likes: number;
  rating: number;
  children_enrolled: number;
  kit_name: string;
}

interface Winner {
  name: string;
  age: string;
  school: string;
  organization: string;
  scholarship: string;
  championType: string;
  imageSrc: string;
}

export default function Page() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const winners: Winner[] = [
    {
      name: "Shanaya Prashad Kaul",
      age: "5 years",
      school: "Prometheus School",
      organization: "Space Creations & NASA",
      scholarship: "₹ 5000 Scholarship",
      championType: "ROBOTICS CHAMPION",
      imageSrc: "/WinnerCard/photo1.png",
    },
    {
      name: "Hrishik Gautam",
      age: "10 years",
      school: "Lotus Valley",
      organization: "Robotic Cars and Stunts",
      scholarship: "₹ 5000 Scholarship",
      championType: "ROBOTICS CHAMPION",
      imageSrc: "/WinnerCard/photo2.png",
    },
  ];

  // Fetch workshops data from the API
  const fetchWorkshops = async () => {
    try {
      const response = await fetch("/api/workshops");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWorkshops(data.data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsFooterVisible(currentScrollY < lastScrollY || currentScrollY === 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-5">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-20 border-b rounded-lg">
        <div className="flex items-center justify-between mb-1">
          {/* Welcome Section */}
          <div className="flex-shrink">
            <h1 className="text-2xl font-bold text-blue-gl">
              Welcome <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              To Lego-In-Action Workshops
            </p>
          </div>

          {/* Responsive Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/LOGO.png"
              alt="Logo"
              className="h-auto max-w-full object-contain"
              width={132}
              height={48}
              priority
            />
          </div>
        </div>
      </div>

      {/* Fixed Workshop Date Picker */}
      <div className="fixed top-[105px] left-0 right-0 max-w-md mx-auto z-20 px-4">
        <WorkshopDatePicker
          stepLabel="Step 1"
          title="Pick up your workshop date"
        />
      </div>

      {/* Main Content */}
      <div className="p-4 mt-[75px]">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          workshops.map((workshop, index) => (
            <React.Fragment key={workshop._id}>
              <WorkshopCard
                _id={workshop._id}
                date={workshop.date_of_workshop}
                enrolled={workshop.children_enrolled}
                price={workshop.rate}
                src={workshop.video_url}
                theme={workshop.theme}
                kitName={workshop.kit_name}
              />
              {/* Display WinnerCard after every 3 WorkshopCards */}
              {(index + 1) % 3 === 0 && winners.length > 0 && (
                <WinnerCard
                  key={`winner-${index}`}
                  {...winners[Math.floor(index / 3) % winners.length]}
                />
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white p-4 border-t transition-transform duration-300 z-50 ${
          isFooterVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Footer />
      </div>
    </div>
  );
}
