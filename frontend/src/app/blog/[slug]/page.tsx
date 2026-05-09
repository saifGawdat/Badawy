import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleClient } from "@/components/blog/BlogArticleClient";
import { fetchBlogPostBySlug } from "@/lib/blog-server";
import { SITE_URL, GLOBAL_KEYWORDS, buildMetadata } from "@/lib/seo";

export const dynamic = 'force-dynamic';

type Props = { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ lang?: string }>
};


export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const post = await fetchBlogPostBySlug(slug);
  const locale = lang === 'en' ? 'en' : 'ar';

  if (!post) {
    return buildMetadata({
      title: "مقال | د. مصطفى بدوي",
      description: "مدونة د. مصطفى بدوي الطبية.",
      canonical: `${SITE_URL}/blog/${slug}`,
      locale,
    });
  }

  const title = post.metaTitle?.trim() || post.title;
  const description = post.metaDescription?.trim() || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.featuredImage || `${SITE_URL}/og-default.jpg`;

  return buildMetadata({
    title,
    titleAr: post.titleAr || title,
    description,
    descriptionAr: post.excerptAr || description,
    canonical: url,
    image,
    type: "article",
    publishedTime: post.publishedAt?.toString() || post.createdAt?.toString(),
    modifiedTime: post.updatedAt?.toString(),
    locale,
  });
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
