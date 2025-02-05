import React from "react";
import Image from "next/image";
import { analytics, logEvent } from "@/lib/firebaseConfig";

const handleLinkClick = (linkName: string) => {
  console.log(`Logging event for link: ${linkName}`);
  if (analytics) {
    logEvent(analytics, "more_questions", { link_name: linkName });
  } else {
    console.warn("Analytics is not initialized");
  }
};

const Footer: React.FC = () => {
  return (
    <footer
      className={`bg-gradient-to-r from-customPink to-customYellow p-2 text-center fixed left-0 bottom-0 w-full flex flex-col items-center justify-center lg:justify-center lg:items-center z-50`}
    >
      <h2 className="text-base lg:text-lg font-bold mb-2 lg:mb-0">
        More questions?
      </h2>
      <div className="flex justify-center gap-2 text-xs lg:text-base text-gray-700">
        <a
          href="https://wa.me/+919468074074"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
          onClick={() => handleLinkClick("whatsapp")}
        >
          <Image
            src="/icons/whatsapp.svg"
            alt="WhatsApp"
            width={16}
            height={16}
          />
          <span>9468074074</span>
        </a>
        <a
          href="https://www.instagram.com/genius_labs.live/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
          onClick={() => handleLinkClick("instagram")}
        >
          <Image
            src="/icons/instagram.svg"
            alt="Instagram"
            width={16}
            height={16}
          />
          <span>genius_labs.live</span>
        </a>
        <a
          href="https://www.google.com/maps/dir//SkymarkOne+Ground+Floor,+OFFICE,+next+to+Paytm,+Sector+98,+Noida,+Uttar+Pradesh+201303/@28.5319061,77.2789364,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x390ce7c3064968ab:0x129af5297a9866b7!2m2!1d77.3613378!2d28.531931?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%D"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
          onClick={() => handleLinkClick("location")}
        >
          <Image
            src="/icons/location.svg"
            alt="Location"
            width={16}
            height={16}
          />
          <span>Skymark Noida98</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
