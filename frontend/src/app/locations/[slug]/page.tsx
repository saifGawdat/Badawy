import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  buildMetadata,
  buildLocationJsonLd,
  buildBreadcrumbJsonLd,
  SITE_URL,
} from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

async function fetchLocationBySlug(slug: string) {
  try {
    const location = await db.location.findUnique({
      where: { slug },
    });
    return location;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const location = await fetchLocationBySlug(slug);
  const locale = lang === "en" ? "en" : "ar";

  if (!location) {
    return buildMetadata({
      title: "الفرع | د. مصطفى بدوي",
      description: "تفاصيل فرع عيادات د. مصطفى بدوي.",
      canonical: `${SITE_URL}/locations/${slug}`,
      locale,
    });
  }

  return buildMetadata({
    title:
      location.metaTitle?.trim() ||
      `${location.name} | د. مصطفى بدوي`,
    titleAr:
      location.metaTitleAr?.trim() ||
      location.nameAr ||
      location.name,
    description:
      location.metaDescription?.trim() ||
      `Visit Dr. Mostafa Badawi's clinic at ${location.name}. Address: ${location.address}. Phone: ${location.phone}.`,
    descriptionAr:
      location.metaDescriptionAr?.trim() ||
      location.addressAr ||
      location.address,
    canonical: `${SITE_URL}/locations/${slug}`,
    locale,
  });
}

export default async function LocationDetailPage({
  params,
}: Props) {
  const { slug } = await params;
  const location = await fetchLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const locationJsonLd = buildLocationJsonLd({
    name: location.name,
    nameAr: location.nameAr || undefined,
    address: location.address,
    addressAr: location.addressAr || undefined,
    phone: location.phone,
    googleMapsUrl: location.googleMapsUrl,
    workingHours: location.workingHours,
    workingHoursAr: location.workingHoursAr || undefined,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", nameAr: "الرئيسية", url: SITE_URL },
    {
      name: location.name,
      nameAr: location.nameAr || location.name,
      url: `${SITE_URL}/locations/${slug}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-secondary via-secondary/95 to-secondary py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-10" />
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {location.nameAr || location.name}
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto font-medium">
              {location.addressAr || location.address}
            </p>
          </div>
        </section>

        {/* Details Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-bone">
              <iframe
                src={convertToEmbedUrl(location.googleMapsUrl)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={location.name}
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif text-secondary mb-2">
                  {location.nameAr || location.name}
                </h2>
                <div className="w-16 h-1 bg-primary rounded-full" />
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">العنوان</h3>
                    <p className="text-secondary/70 font-medium leading-relaxed">{location.addressAr || location.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">الهاتف</h3>
                    <p className="text-secondary/70 font-medium leading-relaxed" dir="ltr">{location.phone}</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">مواعيد العمل</h3>
                    <p className="text-secondary/70 font-medium leading-relaxed whitespace-pre-line">{location.workingHoursAr || location.workingHours}</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-primary/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  <span>فتح في خرائط جوجل</span>
                </a>
                <a href={`tel:${location.phone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-secondary/5 hover:bg-secondary text-secondary hover:text-white px-8 py-3.5 rounded-full font-medium transition-all border border-secondary/10">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span>اتصل الآن</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/**
 * Convert a standard Google Maps share URL to an embed URL.
 */
function convertToEmbedUrl(url: string): string {
  if (url.includes("google.com/maps/embed")) return url;
  return url;
}
