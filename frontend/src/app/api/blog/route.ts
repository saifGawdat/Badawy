import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET /api/blog - Get published posts
export const GET = withErrorHandler(async () => {
  const posts = await db.blogPost.findMany({
    where: { published: true },
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
      metaTitle: true,
      metaDescription: true,
      readingTimeMinutes: true,
    },
    orderBy: [
      { publishedAt: 'desc' },
      { createdAt: 'desc' },
    ],
  });
  
  return NextResponse.json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// POST /api/blog - Create new post (Admin)
export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    
    const title = String(formData.get('title') || '');
    const titleAr = String(formData.get('titleAr') || '');
    const slugBody = String(formData.get('slug') || '');
    const excerpt = String(formData.get('excerpt') || '');
    const excerptAr = String(formData.get('excerptAr') || '');
    const content = String(formData.get('content') || '');
    const contentAr = String(formData.get('contentAr') || '');
    const metaTitle = String(formData.get('metaTitle') || '');
    const metaDescription = String(formData.get('metaDescription') || '');
    const published = formData.get('published') === 'true';
    const file = formData.get('featuredImage') as File | null;

    if (!title || !excerpt || !content) {
      return apiError('Title, excerpt, and content are required', 400);
    }
    if (!file) {
      return apiError('Featured image is required', 400);
    }

    let slug = slugify(slugBody || title);
    if (!slug) slug = `post-${Date.now()}`;

    const exists = await db.blogPost.findUnique({ where: { slug } });
    if (exists) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const featuredImage = await uploadToCloudinary(buffer, 'badawy_blog_featured');

    const readingTimeMinutes = readingTimeFromMarkdown(content);

    const post = await db.blogPost.create({
      data: {
        title: title.trim(),
        titleAr: titleAr.trim(),
        slug,
        excerpt: excerpt.trim(),
        excerptAr: excerptAr.trim(),
        content,
        contentAr,
        featuredImage,
        published,
        publishedAt: published ? new Date() : null,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        readingTimeMinutes,
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
    }, { status: 201 });
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
