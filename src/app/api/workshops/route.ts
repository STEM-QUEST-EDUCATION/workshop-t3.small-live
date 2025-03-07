import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { workshop } from "@/models/Workshop";

export const GET = async () => {
  try {
    // Safely connect to the database
    await connectDB();

    // Fetch all workshop details from the collection
    const workshops = await workshop.find();

    // Return the workshops data
    return NextResponse.json(
      { success: true, data: workshops },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        }
      }
    );
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch workshops" },
      { status: 500 }
    );
  }
};
