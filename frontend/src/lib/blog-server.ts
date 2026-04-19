import { db } from './db';

export type BlogPostPublic = {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  excerpt: string;
  excerptAr?: string;
  content: string;
  contentAr?: string;
  featuredImage: string;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMinutes?: number;
};

export type BlogPostListItem = Omit<
  BlogPostPublic,
  "content" | "contentAr"
>;

// Helper to convert Date to string if needed for hydration
const serializeDates = <T>(obj: T): T => {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
};

export async function fetchPublishedBlogPosts(): Promise<BlogPostListItem[]> {
  try {
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
    
    return serializeDates(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPostPublic | null> {
  try {
    const post = await db.blogPost.findFirst({
      where: {
        slug: slug,
        published: true,
      },
    });
    
    if (!post) return null;
    return serializeDates(post);
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}
