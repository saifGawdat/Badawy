import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/before-after/[id] - Get a single entry
export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const entry = await db.beforeAfter.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: entry });
});

// PATCH /api/before-after/[id] - Update an entry (Admin)
export const PATCH = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const formData = await req.formData();
    
    const existing = await db.beforeAfter.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    const updates: Record<string, string> = {};
    
    // Text fields
    ['title', 'titleAr'].forEach(field => {
      const val = formData.get(field);
      if (val !== null) updates[field] = String(val);
    });

    // Images
    const { uploadToCloudinary } = await import('@/lib/cloudinary');
    
    const beforeFile = formData.get('beforeImage') as File | null;
    if (beforeFile) {
      const buffer = Buffer.from(await beforeFile.arrayBuffer());
      updates.beforeImageUrl = await uploadToCloudinary(buffer, 'badawy_before_after');
    }

    const afterFile = formData.get('afterImage') as File | null;
    if (afterFile) {
      const buffer = Buffer.from(await afterFile.arrayBuffer());
      updates.afterImageUrl = await uploadToCloudinary(buffer, 'badawy_before_after');
    }

    const updated = await db.beforeAfter.update({
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
    await db.beforeAfter.delete({ where: { id } });
    return NextResponse.json({ success: true, data: {} });
  })
);
