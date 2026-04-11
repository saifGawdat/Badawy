import type { MetadataRoute } from "next";

const getApiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
    /\/$/,
    ""
  );

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  try {
    const res = await fetch(`${getApiBase()}/blog/sitemap-data`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const posts: { slug: string; updatedAt?: string }[] = await res.json();
      for (const p of posts) {
        entries.push({
          url: `${base}/blog/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.65,
        });
      }
    }
  } catch {
    /* ignore */
  }

  return entries;
}
