import type { Metadata } from "next";
import { BookingProvider } from '@/contexts/BookingContext';
import "./globals.css";
import { nunito } from "@/styles/fonts";
import Script from 'next/script';
import Image from "next/image";


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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1269850464093849');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <Image
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1269850464093849&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <BookingProvider>
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Lego Robotics & AI Workshops for Kids | Lego-In-Action",
  description: "Transform your child's future with hands-on Lego robotics and AI workshops. Develop critical thinking, coding, and STEM skills through fun, interactive learning. Join Singapore's leading kids' tech education program.",
  keywords: "Lego robotics workshop, AI for kids, STEM education, coding for children, robotics classes Singapore, kids technology workshop, Lego programming, educational workshops",
  openGraph: {
    title: "Lego Robotics & AI Workshops for Kids | Lego-In-Action",
    description: "Transform your child's future with hands-on Lego robotics and AI workshops. Develop critical thinking, coding, and STEM skills through fun, interactive learning.",
    type: "website",
    locale: "en_SG",
    siteName: "Lego-In-Action",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_META_IMAGE_URL}`, 
        width: 1200,
        height: 630,
        alt: "Lego-In-Action Robotics Workshop",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google53767c701146d920.html", 
  },
};


