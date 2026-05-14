import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", nameAr: "الرئيسية", url: SITE_URL },
    { name: "Blog", nameAr: "المدونة", url: `${SITE_URL}/blog` },
  ]);

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
