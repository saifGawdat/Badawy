import type { Metadata } from 'next';
import { HomeClient } from '@/components/sections/HomeClient';
import { buildMetadata, buildDoctorJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'د. مصطفى بدوي | أشطر دكتور تجميل في طنطا والقاهرة ومصر',
  titleAr: 'د. مصطفى بدوي | أشطر دكتور تجميل في طنطا والقاهرة ومصر',
  description:
    'Best plastic surgeon in Egypt — Dr. Mostafa Badawi: rhinoplasty, facelift, liposuction & aesthetic surgery for patients in Cairo, Tanta & nationwide.',
  descriptionAr:
    'أشطر دكتور تجميل في طنطا والقاهرة — د. مصطفى بدوي: تجميل الأنف، شد الوجه، شفط الدهون وأحسن نتائج طبيعية في مصر والدلتا. احجز استشارتك.',
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
