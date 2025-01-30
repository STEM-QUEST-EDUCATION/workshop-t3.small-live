"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";

interface LocationCardProps {
  locationImages: string[];
}

const LocationCard = ({ locationImages }: LocationCardProps) => {
  return (
    <div className="mb-10 bg-white rounded-lg mt-4">
      {/* Location Info */}
      <div className="flex items-center justify-between px-3 py-3.5">
        <div className="flex items-center gap-2.5">
          <a
            href="https://maps.app.goo.gl/oGDvyS4AMor4pcGD6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center p-2">
              <MapPin />
            </div>
          </a>
          <div>
            <a
              href="https://maps.app.goo.gl/oGDvyS4AMor4pcGD6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="custom-font text-sm font-bold hover:underline">
                Skymark One, Noida
              </h2>
            </a>
            <p className="custom-font text-sm font-bold text-gray-500">
              Location
            </p>
          </div>
        </div>
      </div>

      {/* Scrolling Image Section */}
      <div className="relative overflow-hidden">
        <div className="flex gap-2 animate-scroll">
          {/* Duplicating images for smooth looping */}
          {locationImages.concat(locationImages).map((src, index) => (
            <Image
              key={`${src}-${index}`} // Append index to ensure uniqueness
              src={src}
              alt="Location"
              width={170}
              height={100}
              className="rounded-xl flex-shrink-0"
              style={{
                aspectRatio: "16 / 9",
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
