import { connectDB } from "@/lib/mongodb";
import { workshop } from "@/models/Workshop";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    await connectDB();
    const workshops = await workshop
      .find({}, { _id: 1, theme: 1, date_of_workshop: 1, meta: 1 })
      .lean();

    if (!workshops || workshops.length === 0) {
      throw new Error("No workshops found");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
    }

    // Function to format date without milliseconds and with correct type
    const formatDate = (date: Date) =>
      new Date(date).toISOString().slice(0, 19) + "Z";

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Routes -->
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/booking</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      
      <!-- Dynamic Workshop Routes -->
      ${workshops
        .map(
          (workshop) => `
        <url>
          <loc>${baseUrl}/${workshop._id as unknown as string}</loc>
          <lastmod>${formatDate(workshop.date_of_workshop)}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `
        )
        .join("")}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
