"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UsersRound, CalendarDays, Tag } from "lucide-react";
import { logEvent, analytics } from "@/lib/firebaseConfig";

interface WorkshopCardProps {
  _id: string;
  date: string;
  enrolled: number;
  price: number;
  src: string;
  theme: string;
  kitName: string;
}

export function WorkshopCard({
  _id,
  date,
  enrolled,
  price,
  src,
  theme,
  kitName,
}: WorkshopCardProps) {
  const router = useRouter();



  // Memoize the formatted date
  const formattedDate = useMemo(() => {
    try {
      const rawDate = new Date(date);
      if (isNaN(rawDate.getTime())) {
        throw new Error("Invalid date");
      }

      const monthDay = rawDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const weekday = rawDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      return `${monthDay}, ${weekday}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date not available";
    }
  }, [date]);

  // Optimized navigation handler - removed theme from dependencies since it's not used in the function
  const handleExploreClick = useCallback(
  async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Explore button clicked for workshop ID:", _id); // Add this line

    // Log the click event to Firebase Analytics if analytics is supported
    if (analytics) {
      logEvent(analytics, "explore_button_click", { workshop_id: _id });
    }

    try {
      router.push(`/${_id}`);
      console.log("Navigating to:", `/${_id}`); // Add this line
    } catch (error) {
      console.error("Navigation error:", error);
    }
  },
  [router, _id] 
);


  return (
    <Card className="rounded-[12px] overflow-hidden mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="relative" style={{ width: "100%", height: "202.2px" }}>
          <iframe
            src={src}
            allow="autoplay; encrypted-media"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            title={`${theme} Workshop Video`}
          />
          <div className="absolute bottom-0 flex items-center w-full h-10 bg-black bg-opacity-50 px-4">
            <h3 className="text-white text-lg font-bold truncate">{theme}</h3>
          </div>
        </div>

        <div className="p-1 pl-3">
          <div className="flex items-center text-base font-bold justify-between">
            <div className="inline-flex items-center">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              <span className="pl-2 text-gray-700">{formattedDate}</span>
            </div>
            <div className="pt-2">
              <Link
                href={`/${_id}`}
                onClick={handleExploreClick}
                className="inline-block"
              >
                <Button
                  variant="customColor"
                  size="sm"
                  className="ml-auto mr-1 bg-blue-gl hover:bg-blue-gl-hover text-white transition-colors duration-200"
                  onClick={handleExploreClick}
                  >
                  Explore »
                </Button>
              </Link>
            </div>
          </div>

          <div className="font-medium text-xs text-gray-600 mb-1">
            {kitName}
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="cube-wrapper">
              <div className="cube">
                {[
                  { face: "front", icon: "certificate", text: "Certificate" },
                  { face: "back", icon: "badge", text: "Badge" },
                  { face: "top", icon: "trophy", text: "Achievement" },
                  { face: "bottom", icon: "medal", text: "Medal" },
                ].map(({ face, icon, text }) => (
                  <div key={face} className={`face ${face}`}>
                    <Image
                      src={`/icons/${icon}.svg`}
                      alt={icon}
                      width={16}
                      height={16}
                      priority={face === "front"}
                    />
                    <span className="text-xs pl-1">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500">
                <UsersRound className="w-4 h-4 text-user-pink" />
                <span>{enrolled} Enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Tag className="w-4 h-4 text-user-pink -scale-x-100" />
                <span>₹ {price}/-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}