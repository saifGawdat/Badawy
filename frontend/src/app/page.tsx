import type { Metadata } from 'next';
import { HomeClient } from '@/components/sections/HomeClient';
import { buildMetadata, buildDoctorJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'د. مصطفى بدوي | أفضل جراح تجميل في مصر — القاهرة وطنطا',
  titleAr: 'د. مصطفى بدوي | أفضل جراح تجميل في مصر — القاهرة وطنطا',
  description:
    'Best plastic surgeon in Egypt — Dr. Mostafa Badawi: rhinoplasty, facelift, liposuction & aesthetic surgery for patients in Cairo, Tanta & nationwide.',
  descriptionAr:
    'أفضل جراح تجميل في مصر — د. مصطفى بدوي: تجميل الأنف، شد الوجه، شفط الدهون وعمليات التجميل في القاهرة وطنطا وجميع المحافظات. احجز استشارتك.',
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
