import type { Metadata } from "next";
import { nunito } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Booking Form",
  description: "A multi-step booking form",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
