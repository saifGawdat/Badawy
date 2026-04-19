import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET /api/hero-slides/[id] - Get a single slide
export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const slide = await db.heroSlide.findUnique({ where: { id } });

  if (!slide) {
    return apiError('Hero slide not found', 404);
  }

  return NextResponse.json({ success: true, data: slide });
});

// PATCH /api/hero-slides/[id] - Update a slide (Admin)
export const PATCH = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const formData = await req.formData();
    
    // Check if record exists
    const existing = await db.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Hero slide not found', 404);
    }

    const updates: Record<string, string | boolean | undefined> = {};
    
    // Fields to update
    const fields = ['title', 'titleAr', 'subtitle', 'subtitleAr', 'ctaText', 'ctaTextAr'];
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        updates[field] = String(value);
      }
    });

    // Handle Image upload if provided
    const file = formData.get('image') as File | null;
    if (file) {
      const imageUrl = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'badawy_hero_slides');
      updates.imageUrl = imageUrl;
    }

    const updated = await db.heroSlide.update({
      where: { id },
      data: updates , // Type cast for simplicity with dynamic updates
    });

    return NextResponse.json({ success: true, data: updated });
  })
);

// DELETE /api/hero-slides/[id] - Delete a slide (Admin)
export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    
    // Since we use withErrorHandler, Prisma's record-not-found will automatically return 404
    await db.heroSlide.delete({ where: { id } });
    
    return NextResponse.json({ success: true, data: {} });
  })
);
