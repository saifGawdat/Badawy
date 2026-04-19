import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

// POST /api/blog/upload-image - Upload inline image (Admin)
export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return apiError('Please upload an image', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToCloudinary(buffer, 'badawy_blog_inline', ["jpg", "png", "jpeg", "webp", "gif"]);

    return NextResponse.json({
      success: true,
      url
    });
  })
);
