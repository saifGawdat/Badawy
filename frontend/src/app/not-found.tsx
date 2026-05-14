import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "الصفحة غير موجودة | د. مصطفى بدوي",
  titleAr: "الصفحة غير موجودة | د. مصطفى بدوي",
  description:
    "The page you are looking for does not exist or has been moved. الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
  descriptionAr:
    "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. The page you are looking for does not exist or has been moved.",
  canonical: SITE_URL,
  noIndex: true,
});

export default function NotFound() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", nameAr: "الرئيسية", url: SITE_URL },
    { name: "404 - Page Not Found", nameAr: "404 - الصفحة غير موجودة", url: `${SITE_URL}/404` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-8xl font-serif text-primary mb-4">404</h1>
        <h2 className="text-2xl font-serif text-secondary mb-6">
          الصفحة غير موجودة
        </h2>
        <p className="text-secondary/60 mb-10 max-w-md font-medium">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-primary/20"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </>
  );
}
