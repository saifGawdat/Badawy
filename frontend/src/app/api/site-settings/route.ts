import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

const SETTINGS_ID = 'singleton-settings'; // We only ever have one row

export const GET = withErrorHandler(async () => {
  // Try to find the settings, or create if not exists (upsert pattern)
  const settings = await db.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });

  return NextResponse.json({
    success: true,
    data: settings,
  });
});

export const PATCH = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const { phone, whatsappPhone, location, locationAr, facebookUrl, instagramUrl } = body;

    const updateData: Record<string, string> = {};
    if (phone !== undefined) updateData.phone = String(phone || "").trim();
    if (whatsappPhone !== undefined) updateData.whatsappPhone = String(whatsappPhone || "").trim();
    if (location !== undefined) updateData.location = String(location || "").trim();
    if (locationAr !== undefined) updateData.locationAr = String(locationAr || "").trim();
    if (facebookUrl !== undefined) updateData.facebookUrl = String(facebookUrl || "").trim();
    if (instagramUrl !== undefined) updateData.instagramUrl = String(instagramUrl || "").trim();

    const settings = await db.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: updateData,
      create: { 
        id: SETTINGS_ID,
        ...updateData 
      },
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  })
);
