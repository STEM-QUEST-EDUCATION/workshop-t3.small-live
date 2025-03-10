// src/app/layout.tsx
"use client"
import { nunito } from "@/styles/fonts";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import { useEffect, useState } from "react";

const workshopMeta: { [key: string]: { title: string; description: string } } = {
  "6763b880cb2ae23a03f3d3c2": {
    title: "Robotic Cars and Stunts Lego Workshop",
    description: "Build and code LEGO robotic cars with GeniusLabs! Kids 5-11+ tackle hands-on challenges, from Arctic explorers to self-driving cabs, using Scratch like platform & Python. Start your Robotics and AI journey today! 🚗💡",
  },
  "6763b880cb2ae23a03f3d3c6": {
    title: "Smart Home Automation Lego Workshop",
    description: "Explore Smart Home Automation with GeniusLabs! Kids 6-11+ build and code alarms, smart dustbins, and sanitizer dispensers using Scratch like platform & Python. Hands-on STEM learning for a smarter future! 🚀🏡",
  },
  "6763b880cb2ae23a03f3d3c4": {
    title: "Space Creations and NASA Workshop",
    description: "Blast off with Space Creations & NASA-inspired projects at GeniusLabs! Kids 5-11+ build rockets, satellites, and rovers while coding in Scratch like platform & Python. Hands-on STEM fun for future explorers! 🚀🌍",
  },
  "6763b880cb2ae23a03f3d3c7": {
    title: "Robotic Bugs and Insects Lego Workshop",
    description: "Explore Robotic Bugs & Insects at GeniusLabs! Kids 5-11+ build and code crawling robots like hoppers & inchworms using Scratch like platform & Python. Hands-on STEM fun with robotics & biology! 🐛🤖",
  },
  "6763b880cb2ae23a03f3d3c5": {
    title: "Robotics Bikes and Stunts Lego Workshop",
    description: "Build & code Robotic Bikes & Stunts at GeniusLabs! Kids 6-12+ design smart bikes, explore energy transfer, and program movements using Scratch like platform & Python. Hands-on STEM action! 🚴‍♂️⚡",
  },
  "6763b880cb2ae23a03f3d3c1": {
    title: "Smart City Vehicles Lego Workshop",
    description: "Join GeniusLabs' Smart City Vehicles workshop! 🚍🚤 Kids 6-12+ build & code Smart Buses & River Ferries using Scratch like platform & Python, exploring real-world transportation challenges. Hands-on STEM fun!",
  },
  "6763b880cb2ae23a03f3d3c8": {
    title: "Code a Game Workshop",
    description: "🎮 Code a Game! Kids 6-12+ build and program Apple Catcher using Scratch! 🖥️ Learn loops, variables & conditions while designing fun, interactive games. Hands-on coding adventure at GeniusLabs! 🚀",
  },
  "6763b880cb2ae23a03f3d3c3": {
    title: "Drawing Robots Workshop",
    description: "🤖 Robots that Draw or Write! Kids 6-10+ build robots like iRoot, Spirograph, and CNC machines to create shapes, letters & patterns. 🎨 Hands-on learning with MIT Scratch! Develop creativity & coding skills at GeniusLabs. 🚀",
  },
  "67cab965abb6a184893667c0": {
    title: "Drawing Robots Workshop",
    description: "🤖 Robots that Draw or Write! Kids 6-10+ build robots like iRoot, Spirograph, and CNC machines to create shapes, letters & patterns. 🎨 Hands-on learning with MIT Scratch! Develop creativity & coding skills at GeniusLabs. 🚀",
  },
  // Add more workshop meta data here
};

export default function IdLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [meta, setMeta] = useState({
    title: "Default Workshop Title",
    description: "Default workshop description.",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const id = searchParams.get('id');
    if (id && workshopMeta[id]) {
      setMeta(workshopMeta[id]);
    }
  }, [searchParams]);

  return (
    <html lang="en" className={nunito.variable}>
      <Head>
        <title>{isClient ? meta.title : "Loading..."}</title>
        <meta name="description" content={isClient ? meta.description : "Loading..."} />
      </Head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
