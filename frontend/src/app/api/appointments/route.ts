import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';

// POST /api/appointments - Create new appointment (Public)
export const POST = withErrorHandler(async (req: NextRequest) => {
  const {
    fullName,
    email,
    phone,
    procedure,
    message,
    locationId,
    preferredDate,
    preferredTime,
  } = await req.json();

  if (!fullName || !phone || !procedure) {
    return apiError('Full name, phone, and procedure are required', 400);
  }

  const appointment = await db.appointment.create({
    data: {
      fullName,
      email: email || "",
      phone,
      procedure,
      message: message || "",
      locationId: locationId || null,
      preferredDate: preferredDate || "",
      preferredTime: preferredTime || "",
    }
  });

  return NextResponse.json({ success: true, data: appointment }, { status: 201 });
});

// GET /api/appointments - Get all appointments (Admin)
export const GET = withAuth(
  withErrorHandler(async () => {
    const appointments = await db.appointment.findMany({
      include: { location: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  })
);
