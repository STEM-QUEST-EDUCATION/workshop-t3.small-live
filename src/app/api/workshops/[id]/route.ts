import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { workshop } from "@/models/Workshop";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {
  // Extract the workshopId from the URL
  const workshopId = request.nextUrl.pathname.split("/").pop();

  // Ignore requests for static files
  if (workshopId?.includes('.')) {
    return NextResponse.json(
      { success: false, message: "Not Found" },
      { status: 404 }
    );
  }

  try {
    // Validate the workshopId
    if (!workshopId || !Types.ObjectId.isValid(workshopId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Workshop ID" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Fetch the workshop document matching the provided workshopId
    const workshopData = await workshop.findById(workshopId).lean();

    // Handle the case where the workshop is not found
    console.log("workshop data is fetched:", workshopData)

    if (!workshopData) {
      return NextResponse.json(
        { success: false, message: "Workshop not found" },
        { status: 404 } // Not Found
      );
    }

    // Respond with the fetched workshop data
    return NextResponse.json(
      { success: true, data: workshopData },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("Error fetching workshop:", error);

    // Respond with a detailed error message
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}