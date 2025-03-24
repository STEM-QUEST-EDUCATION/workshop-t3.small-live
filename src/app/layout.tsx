import type { Metadata } from "next";
import { BookingProvider } from "@/contexts/BookingContext";
import "./globals.css";
import { nunito } from "@/styles/fonts";
import Script from "next/script";
import { generateOrganizationSchema } from "@/lib/jsonld";

const SITE_NAME = "Genius Labs";
const CANONICAL_URL = "https://geniuslabs.live/";
const META_DESCRIPTION =
  "Best Lego-In-Action Robotics and AI Workshops to boost your child's logical and critical thinking and prepare them for next-gen skills";
const META_IMAGE_URL = "https://geniuslabs.live/stemgames/images/banner.webp"; // Update this to a valid image URL

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        {/* Critical Resources */}
       
        <link
          rel="preload"
          href="/fonts/Nunito-Regular.ttf"
          as="font"
          type="font/ttf"
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

        {/* Google Tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6LCJRQRK8L">
        </script>
        <Script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-6LCJRQRK8L');
          `}
        </Script>

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Genius Labs",
              "description": "${META_DESCRIPTION}",
              "provider": {
                "@type": "Organization",
                "name": "${SITE_NAME}",
                "sameAs": ["${CANONICAL_URL}"]
              },
              "educationalLevel": "Beginner",
              "learningResourceType": "Workshop",
              "image": {
                "@type": "ImageObject",
                "url": "${META_IMAGE_URL}",
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
        <meta property="og:image" content={META_IMAGE_URL} />
        <meta property="og:image:alt" content="Lego Robotics Workshop India" />
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
        url: META_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Lego Robotics Workshop India",
        type: "image/webp"
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
  
};