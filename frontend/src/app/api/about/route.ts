import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/about - Public fetch of about section
export const GET = withErrorHandler(async () => {
  const about = await db.aboutSection.findFirst();
  return NextResponse.json(about || {});
});

// PATCH /api/about - Admin update of about section
export const PATCH = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    
    const body: Record<string, string> = {};
    const textFields = [
      'quoteEn', 'quoteAr', 
      'drNameEn', 'drNameAr', 
      'drTitleEn', 'drTitleAr',
      'stat1Value', 'stat1LabelEn', 'stat1LabelAr',
      'stat2Value', 'stat2LabelEn', 'stat2LabelAr'
    ];
    
    for (const field of textFields) {
      const val = formData.get(field);
      if (val !== null) body[field] = String(val);
    }
    
    const file = formData.get('image') as File | null;
    if (file) {
      const { uploadToCloudinary } = await import('@/lib/cloudinary');
      const buffer = Buffer.from(await file.arrayBuffer());
      body.imageUrl = await uploadToCloudinary(buffer, 'badawy_about');
    }
    
    const existing = await db.aboutSection.findFirst();
    
    let updated;
    if (existing) {
      updated = await db.aboutSection.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      updated = await db.aboutSection.create({
        data: body,
      });
    }
    
    return NextResponse.json({ success: true, data: updated });
  })
);
