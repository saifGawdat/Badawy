import type { Metadata } from "next";
import { buildMetadata, buildServiceJsonLd, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { ServiceDetailsClient } from "./ServiceDetailsClient";

type Props = { params: Promise<{ id: string }> };

async function fetchService(id: string) {
  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
    const res = await fetch(`${apiBase}/items/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = await fetchService(id);

  if (!service) {
    return buildMetadata({
      title: "خدمة التجميل | د. مصطفى بدوي",
      description: "تفاصيل خدمات الجراحة التجميلية لدى د. مصطفى بدوي.",
      canonical: `${SITE_URL}/services/${id}`,
    });
  }

  return buildMetadata({
    title: service.title,
    titleAr: service.titleAr || service.title,
    description: service.description,
    descriptionAr: service.descriptionAr || service.description,
    canonical: `${SITE_URL}/services/${id}`,
    image: service.imageUrl,
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
