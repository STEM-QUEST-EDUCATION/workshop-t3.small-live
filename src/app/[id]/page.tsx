// src/app/[id]/page.tsx
import { Suspense } from "react";
import Loading from "./components/Loading";
import { WorkshopDocument } from "@/models/Workshop";
import ClientWorkshopDetails from "./ClientWorkshopDetails";
import { notFound } from "next/navigation";

function getApiUrl(id: string) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }
  
  // Remove any protocol prefix from the API URL
  const cleanApiUrl = process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '');
  const protocol = process.env.NODE_ENV === "development" ? "http://" : "https://";
  
  return `${protocol}${cleanApiUrl}/api/workshops/${id}`;
}

async function fetchWorkshop(id: string) {
  try {
    const response = await fetch(getApiUrl(id), { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`API response error: ${response.status}`);
    const data = await response.json();
    if (!data.data || !data.success) throw new Error("Invalid data structure");
    return data.data as WorkshopDocument;
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