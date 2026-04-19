import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/blog/manage - Get all posts for admin list
export const GET = withAuth(
  withErrorHandler(async () => {
    const posts = await db.blogPost.findMany({
      select: {
        id: true,
        title: true,
        titleAr: true,
        slug: true,
        excerpt: true,
        excerptAr: true,
        featuredImage: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  })
);
