"use client"

import { motion } from "framer-motion"
import { Ticket } from "lucide-react"
import { useEffect, useState } from "react"

export default function TicketGenerating() {
  // Prevent hydration issues by mounting component only on client side
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Return null during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto relative bg-gradient-to-br from-blue-50 via-blue-100 to-sky-100 dark:from-blue-950 dark:via-blue-900 dark:to-sky-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Container for phone-like appearance */}
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        {/* Animated Ticket Icon */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
          {/* Circular loading animation */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="w-full h-full rounded-full border-4 border-blue-200 border-t-blue-500 dark:border-blue-700 dark:border-t-blue-400" />
          </motion.div>

          {/* Ticket icon with floating animation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          className="text-center space-y-3 sm:space-y-4 w-full max-w-[280px] sm:max-w-[320px] px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 bg-clip-text text-transparent">
            Generating Your Tickets
          </h2>

          <div className="relative">
            <p className="text-sm text-blue-700 dark:text-blue-300">Please wait a moment...</p>
            {/* Loading bar */}
            <motion.div
              className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          {/* Pulsing gradient background */}
          <motion.div
            className="absolute inset-0 opacity-30 dark:opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgb(59 130 246 / 0.15), transparent 40%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute size-24 sm:size-32 opacity-20 dark:opacity-10"
              style={{
                background: `radial-gradient(circle at center, rgb(59 130 246 / 0.2), transparent 70%)`,
                left: `${20 * (i + 1)}%`,
                top: `${15 * (i + 1)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute size-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}

