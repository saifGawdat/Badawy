import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const GET = withErrorHandler(async () => {
  const data = await db.beforeAfter.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, count: data.length, data });
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    const title = String(formData.get('title') || '');
    const titleAr = String(formData.get('titleAr') || '');
    const beforeFile = formData.get('beforeImage') as File | null;
    const afterFile = formData.get('afterImage') as File | null;

    if (!title || !beforeFile || !afterFile) {
      return apiError('Title and both images are required', 400);
    }

    const [beforeUrl, afterUrl] = await Promise.all([
      uploadToCloudinary(Buffer.from(await beforeFile.arrayBuffer()), 'badawy_before_after'),
      uploadToCloudinary(Buffer.from(await afterFile.arrayBuffer()), 'badawy_before_after')
    ]);

    const entry = await db.beforeAfter.create({
      data: { title, titleAr, beforeImageUrl: beforeUrl, afterImageUrl: afterUrl }
    });

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  })
);
