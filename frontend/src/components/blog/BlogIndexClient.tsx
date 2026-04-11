"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { BlogPostListItem } from "@/lib/blog-server";

export function BlogIndexClient({ posts }: { posts: BlogPostListItem[] }) {
  const { isArabic } = useLanguage();

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <header className="max-w-2xl mb-16">
        <p className="text-[10px] uppercase tracking-[0.35em] text-primary mb-3">
          {isArabic ? "المدونة" : "Journal"}
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">
          {isArabic ? "مقالات ورؤى" : "Articles & insights"}
        </h1>
        <p className="text-secondary/55 leading-relaxed">
          {isArabic
            ? "نصائح ومعلومات حول العناية الجمالية والتعافي والجراحة التجميلية."
            : "Tips and information on aesthetic care, recovery, and plastic surgery."}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-secondary/40 font-medium">
          {isArabic ? "لا توجد مقالات بعد." : "No articles yet. Check back soon."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, i) => {
            const title = isArabic && post.titleAr ? post.titleAr : post.title;
            const excerpt =
              isArabic && post.excerptAr ? post.excerptAr : post.excerpt;
            const date = post.publishedAt || post.createdAt;

            return (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group flex flex-col rounded-3xl border border-secondary/10 bg-bone/80 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] block">
                  <Image
                    src={post.featuredImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-secondary/45 mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(date).toLocaleDateString(isArabic ? "ar" : "en", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {post.readingTimeMinutes ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTimeMinutes} min
                      </span>
                    ) : null}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-serif text-secondary group-hover:text-primary transition-colors mb-3 line-clamp-2">
                      {title}
                    </h2>
                  </Link>
                  <p className="text-sm text-secondary/55 line-clamp-3 flex-1 leading-relaxed">
                    {excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 text-sm font-medium text-primary hover:underline underline-offset-4"
                  >
                    {isArabic ? "اقرأ المزيد" : "Read article"}
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
