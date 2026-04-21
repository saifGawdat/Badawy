import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/comments/[id] - Get single comment
export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const comment = await db.comment.findUnique({ where: { id } });
  if (!comment) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: comment });
});

// PATCH /api/comments/[id] - Update comment (Admin)
export const PATCH = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const formData = await req.formData();
    
    const existing = await db.comment.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    const updates: Record<string, string> = {};
    
    // Text fields
    ['username', 'description', 'descriptionAr'].forEach(field => {
      const val = formData.get(field);
      if (val !== null) updates[field] = String(val);
    });

    // Profile Photo
    const file = formData.get('image') as File | null;
    if (file) {
      const { uploadToCloudinary } = await import('@/lib/cloudinary');
      const buffer = Buffer.from(await file.arrayBuffer());
      updates.profilePhoto = await uploadToCloudinary(buffer, 'badawy_comments');
    }

    const updated = await db.comment.update({
      where: { id },
      data: updates
    });

    return NextResponse.json({ success: true, data: updated });
  })
);

// Alias PATCH as PUT for compatibility
export const PUT = PATCH;

export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await db.comment.delete({ where: { id } });
    return NextResponse.json({ success: true, data: {} });
  })
);
