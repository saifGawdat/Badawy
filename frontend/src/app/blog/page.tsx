import type { Metadata } from "next";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { fetchPublishedBlogPosts } from "@/lib/blog-server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Blog | Dr. Mostafa Badawy",
  description:
    "Articles and insights on plastic surgery, recovery, and aesthetic care from Dr. Mostafa Badawy.",
  openGraph: {
    title: "Blog | Dr. Mostafa Badawy",
    description:
      "Articles and insights on plastic surgery, recovery, and aesthetic care.",
    url: `${siteUrl}/blog`,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Dr. Mostafa Badawy",
    description:
      "Articles and insights on plastic surgery, recovery, and aesthetic care.",
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default async function BlogPage() {
  const posts = await fetchPublishedBlogPosts();
  return <BlogIndexClient posts={posts} />;
}
