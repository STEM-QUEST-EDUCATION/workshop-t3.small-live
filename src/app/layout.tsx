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
      <body>
        <BookingProvider>
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Lego-In-Action Robotics and AI Workshops",
  description: "Best Lego-In-Action Robotics and AI Workshops to boost your child's logical and critical thinking and prepare them for next-gen skills",
};


