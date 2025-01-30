import type { Metadata } from "next";
import { BookingProvider } from '@/contexts/BookingContext';
import "./globals.css";
import { nunito } from "@/styles/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <link
          rel="preload"
          href="/ticket/ticketBG.png"
          as="image"
          type="image/png"
        />
      </head>
      <body>
      <BookingProvider>
        {children}
        </BookingProvider>

        </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "WorkShops",
  description: "Best Lego-In-Action Robotics and Coding Workshops to boost your child's logical and critical thinking and prepare them for next-gen skills",
};


