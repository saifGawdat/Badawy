import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler, apiError } from '@/lib/api-error';

// GET /api/blog/slug/[slug] - Get published post by slug
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const post = await db.blogPost.findFirst({
      where: {
        slug: slug,
        published: true,
      },
    });

    if (!post) {
      return apiError('Post not found', 404);
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  }
);
