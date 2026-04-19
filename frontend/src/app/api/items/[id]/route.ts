import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET /api/items/[id] - Get single item
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const item = await db.item.findUnique({
      where: { id }
    });

    if (!item) {
      return apiError(`Service not found with id of ${id}`, 404);
    }

    return NextResponse.json({
      success: true,
      data: item
    });
  }
);

// PUT /api/items/[id] - Update item (Admin)
export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const item = await db.item.findUnique({
      where: { id }
    });

    if (!item) {
      return apiError(`Item not found with id of ${id}`, 404);
    }

    const formData = await req.formData();
    const title = formData.get('title') as string | null;
    const titleAr = formData.get('titleAr') as string | null;
    const description = formData.get('description') as string | null;
    const descriptionAr = formData.get('descriptionAr') as string | null;
    const file = formData.get('image') as File | null;

    const updateData: any = {};
    if (title !== null) updateData.title = title;
    if (titleAr !== null) updateData.titleAr = titleAr;
    if (description !== null) updateData.description = description;
    if (descriptionAr !== null) updateData.descriptionAr = descriptionAr;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      updateData.imageUrl = await uploadToCloudinary(buffer, 'badawy_items');
    }

    const updatedItem = await db.item.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedItem
    });
  })
);

// DELETE /api/items/[id] - Delete item (Admin)
export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const item = await db.item.findUnique({
      where: { id }
    });

    if (!item) {
      return apiError(`Item not found with id of ${id}`, 404);
    }

    await db.item.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      data: {}
    });
  })
);
