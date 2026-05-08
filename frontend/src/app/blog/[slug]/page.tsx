import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleClient } from "@/components/blog/BlogArticleClient";
import { fetchBlogPostBySlug } from "@/lib/blog-server";
import { SITE_URL, GLOBAL_KEYWORDS } from "@/lib/seo";

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) {
    return { title: "مقال | د. مصطفى بدوي" };
  }

  const title = post.metaTitle?.trim() || post.title;
  const description = post.metaDescription?.trim() || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const published = post.publishedAt || post.createdAt;
  const modified = post.updatedAt;
  const image = post.featuredImage || `${SITE_URL}/og-default.jpg`;

  return {
    title: `${title} | د. مصطفى بدوي`,
    description,
    keywords: GLOBAL_KEYWORDS,
    authors: [{ name: "Dr. Mostafa Badawi", url: SITE_URL }],
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "ar_EG",
      alternateLocale: "en_US",
      publishedTime: published instanceof Date ? published.toISOString() : (typeof published === 'string' ? published : undefined),
      modifiedTime: modified instanceof Date ? modified.toISOString() : (typeof modified === 'string' ? modified : undefined),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      siteName: "د. مصطفى بدوي",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        ar: url,
        en: url,
        "x-default": url,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) notFound();

  const headline = post.metaTitle?.trim() || post.title;
  const desc = post.metaDescription?.trim() || post.excerpt;
  const image = post.featuredImage || `${SITE_URL}/og-default.jpg`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description: desc,
    image: [image],
    datePublished: (post.publishedAt || post.createdAt) instanceof Date
      ? (post.publishedAt || post.createdAt).toISOString()
      : (post.publishedAt || post.createdAt),
    dateModified: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
    inLanguage: "ar",
    author: {
      "@type": "Person",
      name: "Dr. Mostafa Badawi",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "د. مصطفى بدوي",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo9.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
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
