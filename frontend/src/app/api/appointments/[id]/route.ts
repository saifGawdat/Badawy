import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';

// PATCH /api/appointments/[id]/status - Update status
export const PATCH = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { status } = await req.json();
    
    if (status !== 'new' && status !== 'contacted') {
      return apiError('Invalid status value', 400);
    }

    const appointment = await db.appointment.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, data: appointment });
  })
);

// DELETE /api/appointments/[id] - Delete appointment
export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await db.appointment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, data: {} });
  })
);
