import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const GET = withErrorHandler(async () => {
  const data = await db.comment.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, count: data.length, data });
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    const username = String(formData.get('username') || '');
    const description = String(formData.get('description') || '');
    const descriptionAr = String(formData.get('descriptionAr') || '');
    const file = formData.get('image') as File | null;

    if (!username || !description || !file) {
      return apiError('Username, description, and profile photo are required', 400);
    }

    const profilePhoto = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()), 'badawy_comments');

    const entry = await db.comment.create({
      data: { username, description, descriptionAr, profilePhoto }
    });

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  })
);
