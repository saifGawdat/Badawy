import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth, AuthUser } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';

// GET /api/locations/[id] - Get single location
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const location = await db.location.findUnique({
      where: { id }
    });

    if (!location) {
      return apiError(`Location not found with id of ${id}`, 404);
    }

    return NextResponse.json({
      success: true,
      data: location
    });
  }
);

// PATCH /api/locations/[id] - Update location (Admin)
const patchHandler = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> },
  user: AuthUser
) => {
  const { id } = await params;
  const body = await req.json();
  
  const location = await db.location.findUnique({
    where: { id }
  });

  if (!location) {
    return apiError(`Location not found with id of ${id}`, 404);
  }

  const updatedLocation = await db.location.update({
    where: { id },
    data: body
  });

  return NextResponse.json({
    success: true,
    data: updatedLocation
  });
};

export const PATCH = withAuth(withErrorHandler(patchHandler));

// DELETE /api/locations/[id] - Delete location (Admin)
const deleteHandler = async (
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> },
  user: AuthUser
) => {
  const { id } = await params;
  
  const location = await db.location.findUnique({
    where: { id }
  });

  if (!location) {
    return apiError(`Location not found with id of ${id}`, 404);
  }

  await db.location.delete({
    where: { id }
  });

  return NextResponse.json({
    success: true,
    data: {}
  });
};

export const DELETE = withAuth(withErrorHandler(deleteHandler));
