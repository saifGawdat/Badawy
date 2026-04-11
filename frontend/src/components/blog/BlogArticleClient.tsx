"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { BlogPostPublic } from "@/lib/blog-server";
import { BlogMarkdown } from "./BlogMarkdown";

export function BlogArticleClient({ post }: { post: BlogPostPublic }) {
  const { isArabic } = useLanguage();
  const title = isArabic && post.titleAr ? post.titleAr : post.title;
  const excerpt = isArabic && post.excerptAr ? post.excerptAr : post.excerpt;
  const content =
    isArabic && post.contentAr?.trim() ? post.contentAr : post.content;
  const date = post.publishedAt || post.createdAt;

  return (
    <article className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-secondary/50 hover:text-primary transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" />
        {isArabic ? "العودة للمدونة" : "Back to blog"}
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-secondary/45 mb-4">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(date).toLocaleDateString(isArabic ? "ar" : "en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {post.readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTimeMinutes} {isArabic ? "دقيقة قراءة" : "min read"}
            </span>
          ) : null}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-secondary leading-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-secondary/60 leading-relaxed">{excerpt}</p>
      </header>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-secondary/10 mb-12 shadow-md">
        <Image
          src={post.featuredImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      <BlogMarkdown markdown={content || ""} />
    </article>
  );
}
