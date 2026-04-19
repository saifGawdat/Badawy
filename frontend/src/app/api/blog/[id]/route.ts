import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

// PUT /api/blog/[id] - Update post (Admin)
export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const post = await db.blogPost.findUnique({ where: { id } });
    if (!post) return apiError('Post not found', 404);

    const formData = await req.formData();
    
    const title = formData.get('title') as string | null;
    const titleAr = formData.get('titleAr') as string | null;
    const slugBody = formData.get('slug') as string | null;
    const excerpt = formData.get('excerpt') as string | null;
    const excerptAr = formData.get('excerptAr') as string | null;
    const content = formData.get('content') as string | null;
    const contentAr = formData.get('contentAr') as string | null;
    const metaTitle = formData.get('metaTitle') as string | null;
    const metaDescription = formData.get('metaDescription') as string | null;
    const publishedRaw = formData.get('published');
    const file = formData.get('featuredImage') as File | null;

    const updateData: Record<string, unknown> = {};
    if (title !== null) updateData.title = title.trim();
    if (titleAr !== null) updateData.titleAr = titleAr.trim();
    if (excerpt !== null) updateData.excerpt = excerpt.trim();
    if (excerptAr !== null) updateData.excerptAr = excerptAr.trim();
    if (content !== null) {
      updateData.content = content;
      updateData.readingTimeMinutes = readingTimeFromMarkdown(content);
    }
    if (contentAr !== null) updateData.contentAr = contentAr;
    if (metaTitle !== null) updateData.metaTitle = metaTitle.trim();
    if (metaDescription !== null) updateData.metaDescription = metaDescription.trim();

    if (slugBody !== null && slugBody.trim()) {
      const newSlug = slugify(slugBody);
      if (newSlug && newSlug !== post.slug) {
        const taken = await db.blogPost.findFirst({
          where: { slug: newSlug, id: { not: post.id } }
        });
        if (taken) return apiError('Slug already in use', 400);
        updateData.slug = newSlug;
      }
    }

    if (publishedRaw !== null) {
      const isPublished = publishedRaw === 'true';
      if (isPublished && !post.published) updateData.publishedAt = new Date();
      updateData.published = isPublished;
    }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      updateData.featuredImage = await uploadToCloudinary(buffer, 'badawy_blog_featured');
    }

    const updatedPost = await db.blogPost.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedPost
    });
  })
);

// DELETE /api/blog/[id] - Delete post (Admin)
export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, data: {} });
  })
);

// Helpers
function slugify(input: string) {
  return String(input || "")
    .toLowerCase().trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function readingTimeFromMarkdown(md: string) {
  const text = String(md || "")
    .replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#*_`>|[\]]/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
