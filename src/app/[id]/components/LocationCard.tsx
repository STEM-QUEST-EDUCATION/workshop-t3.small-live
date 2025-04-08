"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";

interface LocationCardProps {
  locationImages: string[];
  location: {
    address: string;
    city: string;
    country: string;
  };
}

const LocationCard = ({ locationImages, location }: LocationCardProps) => {
  const fullAddress = `${location.address}, ${location.city}, ${location.country}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="mb-10 bg-white rounded-lg mt-4">
      {/* Location Info */}
      <div className="flex items-center justify-between px-3 py-3.5">
        <div className="flex items-center gap-2.5">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center p-2">
              <MapPin />
            </div>
          </a>
          <div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="custom-font text-sm font-bold hover:underline">
                {location.address}
              </h2>
            </a>
            <p className="custom-font text-sm font-bold text-gray-500">
              {location.city}, {location.country}
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
              key={`${src}-${index}`}
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
