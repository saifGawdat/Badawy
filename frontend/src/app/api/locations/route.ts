import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth, AuthUser } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';

// GET /api/locations - Get all locations
export const GET = withErrorHandler(async () => {
  const locations = await db.location.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({
    success: true,
    count: locations.length,
    data: locations
  });
});

// POST /api/locations - Create a new location (Admin)
const createHandler = async (req: NextRequest, ctx: any, user: AuthUser) => {
  const body = await req.json();
  const { 
    name, 
    nameAr, 
    address, 
    addressAr, 
    googleMapsUrl, 
    phone, 
    workingHours, 
    workingHoursAr 
  } = body;

  if (!name || !address || !googleMapsUrl || !phone || !workingHours) {
    return apiError('Name, address, Google Maps URL, phone, and working hours are required', 400);
  }

  const location = await db.location.create({
    data: {
      name,
      nameAr: nameAr || "",
      address,
      addressAr: addressAr || "",
      googleMapsUrl,
      phone,
      workingHours,
      workingHoursAr: workingHoursAr || "",
    }
  });

  return NextResponse.json({
    success: true,
    data: location
  }, { status: 201 });
};

export const POST = withAuth(withErrorHandler(createHandler));
