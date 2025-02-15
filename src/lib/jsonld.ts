import { WorkshopDocument } from "@/models/Workshop";

const SITE_NAME = "Lego-In-Action Workshops";
const CANONICAL_URL = "https://workshops.geniuslabs.live";
const ORG_LOGO_URL = process.env.NEXT_PUBLIC_META_IMAGE_URL;

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: CANONICAL_URL,
    logo: ORG_LOGO_URL,
    sameAs: [
      "https://www.facebook.com/people/Genius-Labs/61551390680852/",
      "https://www.instagram.com/genius_labs.live/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9468074074",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"]
    }
  };
}

export function generateWorkshopSchema(workshop: WorkshopDocument | null) {
  if (!workshop) {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Lego Robotics Workshop",
      description: "Join our exciting Lego robotics workshop",
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        sameAs: [CANONICAL_URL]
      },
      educationalLevel: "Beginner",
      learningResourceType: "Workshop"
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${workshop.theme} Workshop`,
    description: workshop.meta,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: [CANONICAL_URL]
    },
    educationalLevel: "Beginner",
    learningResourceType: "Workshop",
    image: {
      "@type": "ImageObject",
      url: process.env.NEXT_PUBLIC_META_IMAGE_URL,
      width: 1200,
      height: 630
    },
    datePosted: new Date().toISOString(),
    inLanguage: "hi-IN",
    isFamilyFriendly: true,
    priceCurrency: "INR",
    price: workshop.rate.toString(),
    location: {
      "@type": "Place",
      name: workshop.location.address,
      address: {
        "@type": "PostalAddress",
        addressLocality: workshop.location.city,
        addressCountry: workshop.location.country
      }
    },
    offers: {
      "@type": "Offer",
      price: workshop.rate.toString(),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: workshop.date_of_workshop
    }
  };
}

export function generateBreadcrumbSchema(workshop: WorkshopDocument | null) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: CANONICAL_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: workshop ? workshop.theme : "Workshops",
        item: workshop ? `${CANONICAL_URL}/${workshop._id}` : `${CANONICAL_URL}/workshops`
      }
    ]
  };
} 