import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const GET = withErrorHandler(async () => {
  const data = await db.heroSlide.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, count: data.length, data });
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    const title = String(formData.get('title') || '');
    const titleAr = String(formData.get('titleAr') || '');
    const subtitle = String(formData.get('subtitle') || '');
    const subtitleAr = String(formData.get('subtitleAr') || '');
    const ctaText = String(formData.get('ctaText') || 'Read More');
    const ctaTextAr = String(formData.get('ctaTextAr') || '');
    const file = formData.get('image') as File | null;

    if (!title || !subtitle || !file) {
      return apiError('Title, subtitle, and image are required', 400);
    }

    const imageUrl = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'badawy_hero_slides');

    const entry = await db.heroSlide.create({
      data: { 
        title, titleAr, subtitle, subtitleAr, 
        ctaText, ctaTextAr, imageUrl 
      }
    });

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  })
);
