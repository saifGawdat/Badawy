import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler, apiError } from "@/lib/api-error";

// GET /api/locations - Get all locations
export const GET = withErrorHandler(async () => {
  const locations = await db.location.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    count: locations.length,
    data: locations,
  });
});

// POST /api/locations - Create a new location (Admin)
const createHandler = async (req: NextRequest) => {
  const body = await req.json();
  const {
    name,
    nameAr,
    address,
    addressAr,
    googleMapsUrl,
    phone,
    workingHours,
    workingHoursAr,
    slug,
    metaTitle,
    metaTitleAr,
    metaDescription,
    metaDescriptionAr,
  } = body;

  if (!name || !address || !googleMapsUrl || !phone || !workingHours || !slug) {
    return apiError(
      "Name, address, Google Maps URL, phone, working hours, and slug are required",
      400,
    );
  }

  const location = await db.location.create({
    data: {
      name,
      nameAr: nameAr || "",
      slug,
      address,
      addressAr: addressAr || "",
      googleMapsUrl,
      phone,
      workingHours,
      workingHoursAr: workingHoursAr || "",
      metaTitle: metaTitle || "",
      metaTitleAr: metaTitleAr || "",
      metaDescription: metaDescription || "",
      metaDescriptionAr: metaDescriptionAr || "",
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: location,
    },
    { status: 201 },
  );
};

export const POST = withAuth(withErrorHandler(createHandler));
