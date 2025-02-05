import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { workshop } from "@/models/Workshop";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to the database
    await connectDB();
    // Use the dynamic route parameter from context
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Workshop ID is required" },
        { status: 400 }
      );
    }

    // Find the workshop by ID
    const workshopData = await workshop.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!workshopData) {
      return NextResponse.json(
        { error: "Workshop not found" },
        { status: 404 }
      );
    }

    // Return the workshop data
    return NextResponse.json(workshopData, { status: 200 });
  } catch (err) {
    console.error("Error in workshop API route:", err);

    // Handle specific ObjectId error
    if (err instanceof Error && err.message.includes("ObjectId")) {
      return NextResponse.json(
        { error: "Invalid workshop ID format" },
        { status: 400 }
      );
    }

    // Generic error handling
    return NextResponse.json(
      {
        error: "Error fetching workshop",
        message: err instanceof Error ? err.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}