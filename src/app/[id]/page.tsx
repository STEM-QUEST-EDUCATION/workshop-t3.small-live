// src/app/[id]/page.tsx
import { Suspense } from "react";
import Loading from "./components/Loading";
import ClientWorkshopDetails from "./ClientWorkshopDetails";
import { notFound } from "next/navigation";
import { generateWorkshopSchema, generateBreadcrumbSchema } from '@/lib/jsonld';

function getApiUrl(id: string) {
  // For server-side rendering, use absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://workshops.geniuslabs.live';
  return `${baseUrl}/api/workshops/${id}`;
}

async function fetchWorkshop(id: string) {
  try {
    const response = await fetch(getApiUrl(id), { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} for ID: ${id}`);
      return null;
    }
    
    const data = await response.json();
    if (!data.data || !data.success) {
      console.error('Invalid data structure:', data);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error("Error fetching workshop:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const workshopData = await fetchWorkshop(resolvedParams.id);
  
  if (!process.env.NEXT_PUBLIC_META_IMAGE_URL) {
    throw new Error('NEXT_PUBLIC_META_IMAGE_URL environment variable is not set');
  }
  
  const metaImageUrl = process.env.NEXT_PUBLIC_META_IMAGE_URL;

  if (!workshopData) {
    return {
      title: "Workshop Booking Page",
      description: "Book your workshop",
      openGraph: {
        images: [{ url: metaImageUrl, width: 1200, height: 630, alt: "Workshop" }],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Workshop Booking Page",
        description: "Book your workshop",
        images: [{ url: metaImageUrl, width: 1200, height: 630, alt: "Workshop" }],
      },
      other: {
        'application/ld+json': [
          JSON.stringify(generateWorkshopSchema(workshopData)),
          JSON.stringify(generateBreadcrumbSchema(workshopData))
        ]
      }
    };
  }

  return {
    title: ` ${workshopData.theme} Workshop`,
    description: workshopData.meta,
    keywords: ['workshop', 'learning', workshopData.theme],
    authors: [{ name: 'Genius Labs' }],
    openGraph: {
      images: [{
        url: `https://res.cloudinary.com/dzwxrbrcc/image/upload/c_limit,w_1200,h_630,q_auto:best,f_auto/v1739260148/rfw5ysda4j3pwyub4lu9.png`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${workshopData.theme}`,
      description: workshopData.meta,
      images: [{
        url: metaImageUrl,
        width: 1200,
        height: 630,
      }],
      creator: '@geniuslabs',
      site: '@geniuslabs',
    },
    icons: {
      icon: '/favicon.ico',
    },
    other: {
      'application/ld+json': [
        JSON.stringify(generateWorkshopSchema(workshopData)),
        JSON.stringify(generateBreadcrumbSchema(workshopData))
      ]
    }
  };
}

export default async function WorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const workshopData = await fetchWorkshop(id);

  if (!workshopData) {
    return notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <ClientWorkshopDetails initialData={workshopData} />
    </Suspense>
  );
}