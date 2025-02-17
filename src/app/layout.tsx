import type { Metadata } from "next";
import { BookingProvider } from "@/contexts/BookingContext";
import "./globals.css";
import { nunito } from "@/styles/fonts";
import Script from "next/script";
import { generateOrganizationSchema } from "@/lib/jsonld";


const SITE_NAME = "Genius Labs";
const CANONICAL_URL = "https://workshops.geniuslabs.live";
const META_DESCRIPTION =
  "Best coding classes for kids in India! Develop STEM skills through Lego robotics and AI workshops. Affordable, interactive courses with expert instructors.";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi-IN" className={nunito.variable} data-theme="light">
      <head>
        {/* Critical Resources */}
        <link rel="preload" href="/globals.css" as="style" />
        <link
          rel="preload"
          href="/fonts/Nunito-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Facebook Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src="https://connect.facebook.net/en_IN/fbevents.js";
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script');
            fbq('init', '1269850464093849');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "Lego Robotics & AI Workshops",
              "description": "${META_DESCRIPTION}",
              "provider": {
                "@type": "Organization",
                "name": "${SITE_NAME}",
                "sameAs": [${CANONICAL_URL}]
              },
              "educationalLevel": "Beginner",
              "learningResourceType": "Workshop",
              "image": {
                "@type": "ImageObject",
                "url": "${process.env.NEXT_PUBLIC_META_IMAGE_URL}",
                "width": 1200,
                "height": 630
              },
              "datePosted": "2025-02-14",
              "inLanguage": "hi-IN",
              "isFamilyFriendly": true,
              "priceCurrency": "INR",
              "price": "1690",
              "availability": "https://schema.org/InStock",
              "review": {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "4.9",
                  "bestRating": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "Parent Review"
                }
              }
            }
          `}
        </script>

        {/* Social Sharing */}
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta
          property="og:image"
          content={process.env.NEXT_PUBLIC_META_IMAGE_URL}
        />
        <meta
          property="og:image:alt"
          content="Lego Robotics Workshop India"
        />
        <meta property="fb:app_id" content="1269850464093849" />

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify(generateOrganizationSchema())}
        </script>
      </head>

      <body className="min-h-screen bg-background font-sans antialiased">
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: "Lego-In-Action Robotics and AI Workshops",
    template: "%s | Lego-In-Action India"
  },
  description: META_DESCRIPTION,
  openGraph: {
    title: "Lego-In-Action Robotics and AI Workshops",
    description:
      "Best Lego-In-Action Robotics and AI Workshops to boost your child's logical and critical thinking and prepare them for next-gen skills",
    type: "website",
    locale: "hi-IN",
    siteName: SITE_NAME,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_META_IMAGE_URL}` || "https://res.cloudinary.com/dzwxrbrcc/image/upload/v1739260148/rfw5ysda4j3pwyub4lu9.png",
        width: 1200,
        height: 630,
        alt: "Lego Robotics Workshop India",
        type: "image/png"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "google-verification-code.html"
  },
  alternates: {
    canonical: CANONICAL_URL,
    types: {
      "application/ld+json": `${CANONICAL_URL}/schema.json`,
      "text/calendar": `${CANONICAL_URL}/calendar.ics`
    }
  },
  icons: {
    icon: "/favicon-in.ico",
    shortcut: "/favicon-shortcut-in.png",
    apple: "/apple-touch-icon-in.png"
  }
};