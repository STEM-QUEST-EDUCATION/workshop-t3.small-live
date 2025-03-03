"use client"

import { useState, useEffect, useRef, type TouchEvent, type MouseEvent } from "react"
import Image from "next/image"

interface EventBanner {
  id: number
  imageUrl: string
  alt: string
}

// Example with PNG images - replace with your actual PNG paths
const eventBanners: EventBanner[] = [
  {
    id: 1,
    imageUrl: "/banner/banner1.png", // Update with your PNG path
    alt: "Book Now the Lego-In-Action Robotics and Coding Workshops powered by LEGO Education, Scratch and other education partners. Learn  Fundamentals of  Robotics, Coding and AI one workshop at a time where new themes keep coming every weekend near you",
  },
  {
    id: 2,
    imageUrl: "/banner/banner2.png", // Update with your PNG path
    alt: "As the children book the workshop and complete the robotics and coding missions, they win multiple points, goodies and are awarded a robotics and coding workshop participation certificate. Children also receive learning flashcards,  LEGO  design challenge sheet, students newsletter on tech, space and robotics  for home",
  },
  {
    id: 3,
    imageUrl: "/banner/banner3.png", // Update with your PNG path
    alt: "GeniusLabs is also organising Robotics and Product Design Workshops powered by Lego Education at Dibber International Preschool. Dibber International Preschool located at Sector 122 is a preschool that uses the Nordic approach to early childhood education. Book the workshops and Experience  the power of  hands-on learning.",
  },
]

const SLIDE_DURATION = 5000 // 5 seconds

export default function EventBannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [key, setKey] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const minSwipeDistance = 50

  useEffect(() => {
    startAutoSlide()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % eventBanners.length)
      setKey((prev) => prev + 1)
    }, SLIDE_DURATION)
  }

  const handleDotClick = (index: number) => {
    setCurrentBanner(index)
    setKey((prev) => prev + 1)
    startAutoSlide()
  }

  const onTouchStart = (e: TouchEvent) => {
    setIsDragging(true)
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    setIsDragging(false)
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentBanner((prev) => (prev + 1) % eventBanners.length)
      setKey((prev) => prev + 1)
      startAutoSlide()
    } else if (isRightSwipe) {
      setCurrentBanner((prev) => (prev - 1 + eventBanners.length) % eventBanners.length)
      setKey((prev) => prev + 1)
      startAutoSlide()
    }
  }

  const onMouseDown = (e: MouseEvent) => {
    setIsDragging(true)
    setTouchEnd(null)
    setTouchStart(e.clientX)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (touchStart === null) return
    setTouchEnd(e.clientX)
  }

  const onMouseUp = () => {
    setIsDragging(false)
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentBanner((prev) => (prev + 1) % eventBanners.length)
      setKey((prev) => prev + 1)
      startAutoSlide()
    } else if (isRightSwipe) {
      setCurrentBanner((prev) => (prev - 1 + eventBanners.length) % eventBanners.length)
      setKey((prev) => prev + 1)
      startAutoSlide()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const onMouseLeave = () => {
    setIsDragging(false)
    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div className="w-full overflow-hidden">
      <div
        className="relative w-full aspect-[16/16]" // Using aspect ratio instead of padding bottom
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {eventBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 
              ${index === currentBanner ? "opacity-100" : "opacity-0"}
              ${isDragging ? "cursor-grabbing" : ""}`}
          >
            <Image
              src={banner.imageUrl || "/placeholder.svg"}
              alt={banner.alt}
              fill
              sizes="100vw"
              priority={index === 0} // Load first image immediately
              className="object-cover"
              draggable={false}
              unoptimized // Since we're using local PNG files
            />
          </div>
        ))}

        {/* Dot indicators with timer */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-10">
          {eventBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="w-2 h-2 relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  index === currentBanner ? "bg-white scale-75" : "bg-gray-400 scale-50 hover:bg-gray-300"
                }`}
              />
              {index === currentBanner && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
                  <circle
                    key={key}
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeDasharray="88"
                    strokeDashoffset="88"
                    className="origin-center -rotate-90"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="88"
                      to="0"
                      dur={`${SLIDE_DURATION}ms`}
                      repeatCount="1"
                    />
                  </circle>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

