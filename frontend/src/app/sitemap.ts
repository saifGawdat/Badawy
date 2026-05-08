import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const getApiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
    /\/$/,
    ""
  );

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

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

  // Dynamic blog posts
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

  // Dynamic service pages
  try {
    const res = await fetch(`${getApiBase()}/items`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const services: { id: string; updatedAt?: string }[] = await res.json();
      for (const s of services) {
        entries.push({
          url: `${base}/services/${s.id}`,
          lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  } catch {
    /* ignore */
  }

  return entries;
}

