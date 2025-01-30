import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

// Types
interface Testimonial {
  id: number;
  name: string;
  relation: string;
  school: string;
  image: string;
  content: string;
}

// Testimonial Data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ruchi",
    relation: "Mother of Arjun and Aanya",
    school: "Heritage Xperiential",
    image: "/parent-face-2.png",
    content:
      "My child's passion for Robotics and Coding has soared since joining Geniuslabs. The IIT-IIM faculty's focus on product thinking has been invaluable.",
  },
  {
    id: 2,
    name: "Vaibhav",
    relation: "Father of Inaya and Reyansh",
    school: "Pathways",
    image: "/parent-face-2.png",
    content:
      "Geniuslabs sparks creativity and critical thinking. Kids deconstruct products, learn from IIT-IIM faculty, and prepare for Olympiads with tools like LEGO BricQ and Spike.",
  },
  {
    id: 3,
    name: "Tanya",
    relation: "Mother of Samar",
    school: "Prometheus",
    image: "/parent-face-2.png",
    content:
      "The expert faculty at Geniuslabs is nurturing my child's curiosity and problem-solving skills.",
  },
  {
    id: 4,
    name: "Tanvi",
    relation: "Mother of Aarav",
    school: "Heritage Xperiential",
    image: "/parent-face-2.png",
    content:
      "Geniuslabs has shifted my child's perspective. By deconstructing products and understanding their design, they've become more creative and inquisitive.",
  },
  {
    id: 5,
    name: "Pradeep",
    relation: "Father of Rudra",
    school: "DPS",
    image: "/parent-face-2.png",
    content:
    "Geniuslabs is the perfect place for young minds to learn and grow. My kid is excited to learn and prepare for the future with LEGO BricQ and Spike."
  },
  
];

// TestimonialCard Component
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative w-full h-[180px] flex-shrink-0 rounded-xl shadow-lg bg-[#fef3f6] p-0">
      {/* Profile Image - Centered and on Top */}
      <div className="absolute -top-8 left-10 transform -translate-x-1/2">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={70}
          height={70}
          className="rounded-full border-4 border-white shadow-md z-10"
        />
      </div>

      {/* Stars - Top Right */}
      <div className="absolute top-4 right-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-sky-500 text-sky-500" />
        ))}
      </div>

      {/* Content */}
      <div className="mt-8 text-center px-4 pt-2">
        <p className="italic text-gray-600 text-sm leading-relaxed">
          {testimonial.content}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 text-xs">
        <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
        <p className="text-gray-500">{testimonial.relation}</p>
      </div>

      {/* School */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 text-gray-500">
        <MapPin className="h-4 w-4 text-sky-500" />
        <span className="text-xs">{testimonial.school}</span>
      </div>
    </div>
  );
}

// Main Testimonials Component
export default function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const duration = 20000; // 20 seconds for one complete scroll
    const distance = scrollContainer.scrollWidth / 2; // Half because we duplicated the testimonials

    const animate = (currentTime: number) => {
      if (isPaused) {
        startTimeRef.current = null;
        lastScrollPositionRef.current = scrollContainer.scrollLeft;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (!startTimeRef.current) {
        startTimeRef.current =
          currentTime - (lastScrollPositionRef.current / distance) * duration;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = (elapsed % duration) / duration;
      const position = distance * progress;

      scrollContainer.scrollLeft = position;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  return (
    <div className="w-full py-4 ">
      {/* Heading */}
      <h2 className="text-base font-semibold text-gray-800">
        What parents say!
      </h2>

      {/* Testimonial Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-hidden p-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {testimonials.concat(testimonials).map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index < testimonials.length ? "orig" : "dup"}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}
