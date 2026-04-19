import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET /api/items - Get all items
export const GET = withErrorHandler(async () => {
  const items = await db.item.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({
    success: true,
    count: items.length,
    data: items
  });
});

// POST /api/items - Create a new item (Admin)
export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    const title = String(formData.get('title') || '');
    const titleAr = String(formData.get('titleAr') || '');
    const description = String(formData.get('description') || '');
    const descriptionAr = String(formData.get('descriptionAr') || '');
    const file = formData.get('image') as File | null;

    if (!title || !description) {
      return apiError('Title and description are required', 400);
    }

    if (!file) {
      return apiError('Please upload an image', 400);
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadToCloudinary(buffer, 'badawy_items');

    const item = await db.item.create({
      data: {
        title,
        titleAr,
        description,
        descriptionAr,
        imageUrl,
      }
    });

    return NextResponse.json({
      success: true,
      data: item
    }, { status: 201 });
  })
);
