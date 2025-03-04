import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SmsLimitModel, { SmsLimitSortOptions } from "@/models/SmsLimit";

// Simple admin API key check - in a real app, use proper authentication
const checkAdminAuth = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.split(' ')[1];
  const adminKey = process.env.ADMIN_API_KEY;
  
  return token === adminKey;
};

// Get all SMS limits or a specific user's limit
export async function GET(req: Request) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if a specific mobile number is requested
    const url = new URL(req.url);
    const mobileNumber = url.searchParams.get('mobileNumber');
    
    let results;
    if (mobileNumber) {
      results = await SmsLimitModel.findOne({ mobileNumber });
      if (!results) {
        return NextResponse.json({ error: 'No record found for this mobile number' }, { status: 404 });
      }
    } else {
      // Define sort options using our type
      const sortOptions: SmsLimitSortOptions = { smsCount: -1 };
      
      // Get a query object from find()
      const query = SmsLimitModel.find();
      
      // Sort and limit the results, handling both mongoose and mock implementations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortedQuery = await (query.sort(sortOptions) as any);
      
      // Handle both array results (mock) and mongoose query results
      if (Array.isArray(sortedQuery)) {
        results = sortedQuery.slice(0, 100);
      } else {
        results = await sortedQuery.limit(100);
      }
    }
    
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching SMS limits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Reset a user's SMS count
export async function POST(req: Request) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { mobileNumber, resetType } = body;
    
    if (!mobileNumber) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }
    
    await connectDB();
    
    let updateData = {};
    
    // Determine what to reset based on resetType
    if (!resetType || resetType === 'all') {
      // Reset both daily and hourly limits
      updateData = { 
        $set: { 
          smsCount: 0, 
          lastReset: new Date(),
          hourlySmsCount: 0,
          lastHourlyReset: new Date()
        } 
      };
    } else if (resetType === 'daily') {
      // Reset only daily limit
      updateData = { 
        $set: { 
          smsCount: 0, 
          lastReset: new Date() 
        } 
      };
    } else if (resetType === 'hourly') {
      // Reset only hourly limit
      updateData = { 
        $set: { 
          hourlySmsCount: 0, 
          lastHourlyReset: new Date() 
        } 
      };
    } else {
      return NextResponse.json({ 
        error: 'Invalid reset type. Use "all", "daily", or "hourly"' 
      }, { status: 400 });
    }
    
    const result = await SmsLimitModel.findOneAndUpdate(
      { mobileNumber },
      updateData,
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: `SMS ${resetType || 'all'} count reset successfully`,
      data: result
    });
  } catch (error) {
    console.error('Error resetting SMS limit:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 