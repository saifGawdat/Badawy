import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mostafabadawi.com"
).replace(/\/$/, "");

export const SITE_NAME = "د. مصطفى بدوي | جراح التجميل";
export const SITE_NAME_EN = "Dr. Mostafa Badawi | Plastic Surgeon";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/** Shared keywords for all pages — EN + AR local intent (Egypt / Cairo / Tanta) */
export const GLOBAL_KEYWORDS = [
  "جراح تجميل",
  "أفضل جراح تجميل في مصر",
  "أفضل دكتور تجميل في القاهرة",
  "أفضل دكتور تجميل في طنطا",
  "جراح تجميل القاهرة",
  "جراح تجميل طنطا",
  "عمليات تجميل مصر",
  "دكتور مصطفى بدوي",
  "تجميل مصر",
  "شد الوجه",
  "تكبير الصدر",
  "شفط الدهون",
  "تجميل الأنف",
  "رينوبلاستي",
  "plastic surgeon Egypt",
  "best plastic surgeon Egypt",
  "best plastic surgeon Cairo",
  "best plastic surgeon Tanta",
  "plastic surgeon Cairo",
  "plastic surgeon Tanta",
  "cosmetic surgeon Egypt",
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
  locale = "ar", // Default to Arabic
}: BuildMetadataOptions & { locale?: "ar" | "en" }): Metadata {
  const ogImage = image || DEFAULT_OG_IMAGE;

  // Use localized versions based on current locale
  const finalTitle = locale === "ar" ? titleAr || title : title;
  const finalDesc =
    locale === "ar" ? descriptionAr || description : description;

  return {
    title: finalTitle,
    description: finalDesc,
    keywords: GLOBAL_KEYWORDS,
    authors: [{ name: "Dr. Mostafa Badawi", url: SITE_URL }],
    creator: "Dr. Mostafa Badawi",
    publisher: SITE_NAME_EN,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        ar: `${canonical}?lang=ar`,
        en: `${canonical}?lang=en`,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: [{ url: ogImage, width: 1200, height: 630, alt: finalTitle }],
      ...(type === "article" && { publishedTime, modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDesc,
      images: [ogImage],
      creator: "@mostafabadawi",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

// ─── JSON-LD Builders ────────────────────────────────────────────────────────

const EGYPT_PLACE = { "@type": "Country" as const, name: "Egypt" };

/** MedicalBusiness + Physician structured data for the homepage */
export function buildDoctorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Physician",
        "@id": `${SITE_URL}/#person`,
        name: "Dr. Mostafa Badawi",
        alternateName: ["د. مصطفى بدوي", "Mostafa Badawi"],
        url: SITE_URL,
        jobTitle: "Plastic & Aesthetic Surgeon",
        medicalSpecialty: "PlasticSurgery",
        description:
          "Plastic and aesthetic surgeon serving patients in Cairo, Tanta, and across Egypt. جراح تجميل يستقبل المرضى في القاهرة وطنطا وجميع أنحاء مصر.",
        image: `${SITE_URL}/og-default.jpg`,
        knowsAbout: [
          "Plastic surgery",
          "Rhinoplasty",
          "Cosmetic surgery Egypt",
          "جراحة تجميل",
          "عمليات الأنف",
        ],
        areaServed: [
          { "@type": "City", name: "Cairo", containedInPlace: EGYPT_PLACE },
          { "@type": "City", name: "Tanta", containedInPlace: EGYPT_PLACE },
          { "@type": "City", name: "Giza", containedInPlace: EGYPT_PLACE },
          EGYPT_PLACE,
        ],
        sameAs: [],
      },
      {
        "@type": "MedicalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "د. مصطفى بدوي — جراح التجميل",
        alternateName: "Dr. Mostafa Badawi Plastic Surgery",
        url: SITE_URL,
        description:
          "عيادة متخصصة في جراحة التجميل والعمليات الترميمية في مصر (القاهرة، طنطا، والدلتا) — أعلى معايير الرعاية الطبية.",
        logo: `${SITE_URL}/logo9.png`,
        image: `${SITE_URL}/og-default.jpg`,
        medicalSpecialty: "PlasticSurgery",
        priceRange: "$$$$",
        areaServed: [
          { "@type": "City", name: "Cairo", containedInPlace: EGYPT_PLACE },
          { "@type": "City", name: "Tanta", containedInPlace: EGYPT_PLACE },
          EGYPT_PLACE,
        ],
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

/** MedicalBusiness structured data for a specific location branch */
export function buildLocationJsonLd(location: {
  name: string;
  nameAr?: string;
  address: string;
  addressAr?: string;
  phone: string;
  googleMapsUrl: string;
  workingHours: string;
  workingHoursAr?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/locations/${location.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: location.nameAr || location.name,
    alternateName: location.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.addressAr || location.address,
      addressLocality:
        location.name.includes("Tanta") ||
        (location.nameAr && location.nameAr.includes("طنطا"))
          ? "Tanta"
          : "Cairo",
      addressCountry: "EG",
    },
    telephone: location.phone,
    url: `${SITE_URL}/locations/${location.name.toLowerCase().replace(/\s+/g, "-")}`,
    hasMap: location.googleMapsUrl,
    openingHours: location.workingHours,
    parentOrganization: {
      "@id": `${SITE_URL}/#business`,
    },
  };
}

/** BreadcrumbList JSON-LD helper */
export function buildBreadcrumbJsonLd(
  crumbs: { name: string; nameAr?: string; url: string }[],
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
