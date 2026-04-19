import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';

// POST /api/appointments - Create new appointment (Public)
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { fullName, email, phone, procedure, message } = await req.json();

  if (!fullName || !email || !phone || !procedure) {
    return apiError('Please fill all required fields', 400);
  }

  const appointment = await db.appointment.create({
    data: {
      fullName,
      email,
      phone,
      procedure,
      message: message || "",
    }
  });

  return NextResponse.json({ success: true, data: appointment }, { status: 201 });
});

// GET /api/appointments - Get all appointments (Admin)
export const GET = withAuth(
  withErrorHandler(async () => {
    const appointments = await db.appointment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  })
);
