const getApiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
    /\/$/,
    ""
  );

export type BlogPostPublic = {
  _id: string;
  title: string;
  titleAr?: string;
  slug: string;
  excerpt: string;
  excerptAr?: string;
  content: string;
  contentAr?: string;
  featuredImage: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMinutes?: number;
};

export type BlogPostListItem = Omit<
  BlogPostPublic,
  "content" | "contentAr"
>;

export async function fetchPublishedBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/blog`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<BlogPostPublic | null> {
  try {
    const res = await fetch(
      `${getApiBase()}/blog/slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 120 } }
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
