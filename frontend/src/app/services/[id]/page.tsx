import type { Metadata } from "next";
import { buildMetadata, buildServiceJsonLd, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { ServiceDetailsClient } from "./ServiceDetailsClient";

type Props = { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ lang?: string }>
};

async function fetchService(id: string) {
  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
    const res = await fetch(`${apiBase}/items/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : json; // Handle envelope if present
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { lang } = await searchParams;
  const service = await fetchService(id);
  const locale = lang === 'en' ? 'en' : 'ar';

  if (!service) {
    return buildMetadata({
      title: "خدمة التجميل | د. مصطفى بدوي",
      description: "تفاصيل خدمات الجراحة التجميلية لدى د. مصطفى بدوي.",
      canonical: `${SITE_URL}/services/${id}`,
      locale,
    });
  }

  return buildMetadata({
    title: service.metaTitle || service.title,
    titleAr: service.metaTitleAr || service.titleAr || service.title,
    description: service.metaDescription || service.description,
    descriptionAr: service.metaDescriptionAr || service.descriptionAr || service.description,
    canonical: `${SITE_URL}/services/${id}`,
    image: service.imageUrl,
    locale,
  });
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;
  const service = await fetchService(id);

  const serviceJsonLd = service
    ? buildServiceJsonLd({ ...service, id })
    : null;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", nameAr: "الرئيسية", url: SITE_URL },
    { name: "Services", nameAr: "الخدمات", url: `${SITE_URL}/#services` },
    {
      name: service?.title || "Service",
      nameAr: service?.titleAr,
      url: `${SITE_URL}/services/${id}`,
    },
  ]);

  return (
    <>
      {serviceJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ServiceDetailsClient id={id} initialService={service} />
    </>
  );
}
