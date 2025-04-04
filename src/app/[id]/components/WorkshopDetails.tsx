import { MapPin, Star, Share2, Heart, Clock3 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Head from "next/head";

interface WorkshopDetailsProps {
  title: string;
  date_of_workshop: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  price: string;
  rating: number;
  duration: number;
  imageUrl: string;
  shareImage: string;
  theme: string;
}

export default function WorkshopDetails({
  title,
  date_of_workshop,
  location,
  price,
  rating,
  duration,
  shareImage,
  theme,
}: WorkshopDetailsProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };
    setFormattedDate(formatDate(date_of_workshop));
  }, [date_of_workshop]);

  const [isHeartClicked, setIsHeartClicked] = useState(false);

  const toggleHeart = () => {
    setIsHeartClicked((prev) => !prev);
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareData = {
      title,
      text: `Here is the link to the ${title} workshop, themed *${theme}* ${currentUrl}\nLet's plan to book our spots for this or the upcoming workshops at _${location.address}, ${location.city}._ Check them out!`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert("Sharing is not supported in your browser.");
      }
    } catch (error) {
      console.error("Error sharing content:", error);
      alert("Failed to share. Please try again.");
    }
  };

  useEffect(() => {
    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (metaOgUrl) {
      metaOgUrl.setAttribute("content", window.location.href);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Join the ${title} workshop to explore exciting projects and skills.`}
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={`Join the ${title} workshop happening on ${date_of_workshop}.`}
        />
        <meta property="og:image" content={shareImage} />
        <meta property="og:url" content="" />
      </Head>

      <div className="bg-white rounded-2xl pt-2 pb-1 px-2 shadow-lg">
        <div className="flex justify-between items-start">
          <p className="text-xs text-gray-500 custom-font">
            {formattedDate}
          </p>
          <div className="flex gap-1">
            <button className="text-gray-500" onClick={handleShare}>
              <Share2 size={18} />
            </button>

            <button
              className={`text-gray-500 ${
                isHeartClicked ? "text-red-500" : ""
              }`}
              onClick={toggleHeart}
            >
              <Heart
                size={18}
                className={`${isHeartClicked ? "fill-red-500" : ""}`}
              />
            </button>
          </div>
        </div>

        <h1 className="text-base font-bold text-gray-900 custom-font">
          {title}
        </h1>

        <div className="flex items-center text-sm font-normal text-gray-500 custom-font">
          <MapPin size={14} className="mr-1 text-pink-500" />
          <span>{`${location.address}, ${location.city}`}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/icons/wallet.svg"
              alt="Wallet Icon"
              width={16}
              height={16}
              className="w-3 h-3 mr-1"
            />
            <span className="text-sm font-normal text-gray-500 custom-font">
              {price}
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <Star size={14} style={{ color: "#EC5E84" }} className="mr-1" />
              <span className="text-sm font-normal text-gray-500 custom-font">
                {rating}
              </span>
            </div>
            <div className="flex items-center ml-2">
              <Clock3 size={14} style={{ color: "#EC5E84" }} />
              <span className="text-sm font-normal text-gray-500 custom-font ml-1">
                {duration} hr
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
