import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';

// GET /api/blog/manage/[id] - Get full post for admin editor
export const GET = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const post = await db.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return apiError(`Post not found with id of ${id}`, 404);
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  })
);
