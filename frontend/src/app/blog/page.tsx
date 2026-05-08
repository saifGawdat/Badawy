import type { Metadata } from "next";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { fetchPublishedBlogPosts } from "@/lib/blog-server";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: "مدونة التجميل | د. مصطفى بدوي",
  titleAr: "مدونة التجميل | د. مصطفى بدوي",
  description:
    "Articles and insights on plastic surgery, recovery, and aesthetic care from Dr. Mostafa Badawi.",
  descriptionAr:
    "مقالات ونصائح حول جراحة التجميل والتعافي والعناية بالمظهر — بقلم د. مصطفى بدوي.",
  canonical: `${SITE_URL}/blog`,
  image: DEFAULT_OG_IMAGE,
});

export default async function BlogPage() {
  const posts = await fetchPublishedBlogPosts();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", nameAr: "الرئيسية", url: SITE_URL },
    { name: "Blog", nameAr: "المدونة", url: `${SITE_URL}/blog` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogIndexClient posts={posts} />
    </>
  );
}

