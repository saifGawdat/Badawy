import type { Metadata } from 'next';
import { HomeClient } from '@/components/sections/HomeClient';
import { buildMetadata, buildDoctorJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'د. مصطفى بدوي | أفضل جراح تجميل',
  titleAr: 'د. مصطفى بدوي | أفضل جراح تجميل',
  description:
    'Dr. Mostafa Badawi — Premium plastic & aesthetic surgery. Rhinoplasty, facelift, liposuction & more.',
  descriptionAr:
    'د. مصطفى بدوي — جراح تجميل متخصص في عمليات الأنف، شد الوجه، شفط الدهون وغيرها. احجز استشارتك الآن.',
  canonical: SITE_URL,
  image: `${SITE_URL}/og-default.jpg`,
});

export default function LandingPage() {
  const jsonLd = buildDoctorJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
