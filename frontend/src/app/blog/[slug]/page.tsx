import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleClient } from "@/components/blog/BlogArticleClient";
import { fetchBlogPostBySlug } from "@/lib/blog-server";

type Props = { params: Promise<{ slug: string }> };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) {
    return { title: "Article | Dr. Mostafa Badawy" };
  }

  const title = post.metaTitle?.trim() || post.title;
  const description = post.metaDescription?.trim() || post.excerpt;
  const url = `${siteUrl}/blog/${post.slug}`;
  const published = post.publishedAt || post.createdAt;
  const modified = post.updatedAt;

  return {
    title: `${title} | Dr. Mostafa Badawy`,
    description,
    authors: [{ name: "Dr. Mostafa Badawy", url: siteUrl }],
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: published,
      modifiedTime: modified,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: title }]
        : undefined,
      siteName: "Dr. Mostafa Badawy",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) notFound();

  const headline = post.metaTitle?.trim() || post.title;
  const desc = post.metaDescription?.trim() || post.excerpt;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description: desc,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: "Dr. Mostafa Badawy",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Dr. Mostafa Badawy",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticleClient post={post} />
    </>
  );
}
