import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mostafabadawi.com"
).replace(/\/$/, "");

export const SITE_NAME = "د. مصطفى بدوي | جراح التجميل";
export const SITE_NAME_EN = "Dr. Mostafa Badawi | Plastic Surgeon";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/** Shared keywords for all pages */
export const GLOBAL_KEYWORDS = [
  "جراح تجميل",
  "عمليات تجميل",
  "دكتور مصطفى بدوي",
  "تجميل مصر",
  "شد الوجه",
  "تكبير الصدر",
  "شفط الدهون",
  "تجميل الأنف",
  "رينوبلاستي",
  "plastic surgeon Egypt",
  "aesthetic surgery",
  "rhinoplasty Egypt",
  "cosmetic surgery Cairo",
  "Dr. Mostafa Badawi",
];

interface BuildMetadataOptions {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  canonical: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

/** Build a full Next.js Metadata object following SEO best practices */
export function buildMetadata({
  title,
  titleAr,
  description,
  descriptionAr,
  canonical,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const ogImage = image || DEFAULT_OG_IMAGE;
  // Prefer Arabic title for OG since audience is Arab-first
  const ogTitle = titleAr || title;
  const ogDesc = descriptionAr || description;

  return {
    title,
    description,
    keywords: GLOBAL_KEYWORDS,
    authors: [{ name: "Dr. Mostafa Badawi", url: SITE_URL }],
    creator: "Dr. Mostafa Badawi",
    publisher: SITE_NAME_EN,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        "ar": canonical,
        "en": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: "ar_EG",
      alternateLocale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
      creator: "@mostafabadawi",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

// ─── JSON-LD Builders ────────────────────────────────────────────────────────

/** MedicalBusiness + Person structured data for the homepage */
export function buildDoctorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Dr. Mostafa Badawi",
        alternateName: "د. مصطفى بدوي",
        url: SITE_URL,
        jobTitle: "Plastic & Aesthetic Surgeon",
        description:
          "جراح تجميل متخصص في العمليات التجميلية والترميمية بخبرة واسعة في مصر والشرق الأوسط.",
        image: `${SITE_URL}/og-default.jpg`,
        sameAs: [],
      },
      {
        "@type": "MedicalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "د. مصطفى بدوي — جراح التجميل",
        alternateName: "Dr. Mostafa Badawi Plastic Surgery",
        url: SITE_URL,
        description:
          "عيادة متخصصة في جراحة التجميل والعمليات الترميمية، تقدم أعلى معايير الرعاية الطبية.",
        logo: `${SITE_URL}/logo9.png`,
        image: `${SITE_URL}/og-default.jpg`,
        medicalSpecialty: "PlasticSurgery",
        priceRange: "$$$$",
        areaServed: {
          "@type": "Country",
          name: "Egypt",
        },
        hasMap: "",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["Arabic", "English"],
        },
        founder: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: ["ar", "en"],
        publisher: { "@id": `${SITE_URL}/#business` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/** MedicalProcedure structured data for service pages */
export function buildServiceJsonLd(service: {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${SITE_URL}/services/${service.id}`,
    name: service.titleAr || service.title,
    alternateName: service.title,
    description: service.descriptionAr || service.description,
    image: service.imageUrl,
    procedureType: "https://health-lifesci.schema.org/NoninvasiveProcedure",
    status: "https://health-lifesci.schema.org/ActiveActionStatus",
    provider: {
      "@id": `${SITE_URL}/#business`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/services/${service.id}`,
    },
  };
}

/** BreadcrumbList JSON-LD helper */
export function buildBreadcrumbJsonLd(
  crumbs: { name: string; nameAr?: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.nameAr || c.name,
      item: c.url,
    })),
  };
}
