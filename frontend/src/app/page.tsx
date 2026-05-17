import type { Metadata } from 'next';
import { HomeClient } from '@/components/sections/HomeClient';
import { buildMetadata, buildDoctorJsonLd, buildFaqJsonLd, SITE_URL } from '@/lib/seo';

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;
  const locale = lang === 'en' ? 'en' : 'ar';
  
  return buildMetadata({
    title: 'Dr. Mostafa Badawi | Best Plastic Surgeon in Egypt — Cairo & Tanta',
    titleAr: 'د. مصطفى بدوي | أفضل جراح تجميل في مصر — القاهرة وطنطا',
    description:
      'Best plastic surgeon in Egypt — Dr. Mostafa Badawi: rhinoplasty, facelift, liposuction & aesthetic surgery for patients in Cairo, Tanta & nationwide.',
    descriptionAr:
      'أفضل جراح تجميل في مصر — د. مصطفى بدوي: تجميل الأنف، شد الوجه، شفط الدهون وعمليات التجميل في القاهرة وطنطا وجميع المحافظات. احجز استشارتك.',
    canonical: SITE_URL,
    image: `${SITE_URL}/og-default.jpg`,
    locale,
  });
}

export default function LandingPage() {
  const jsonLd = buildDoctorJsonLd();
  
  const faqJsonLd = buildFaqJsonLd([
    {
      question: "من هو أفضل دكتور تجميل في مصر؟ (Who is the best plastic surgeon in Egypt?)",
      answer: "Dr. Mostafa Badawi is widely regarded as one of the best plastic surgeons in Egypt, specializing in rhinoplasty, facelift, and body contouring, with clinics in Cairo and Tanta."
    },
    {
      question: "Where are Dr. Mostafa Badawi's clinics located?",
      answer: "Dr. Mostafa Badawi operates out of top-tier medical facilities in Cairo and Tanta, serving patients nationwide."
    },
    {
      question: "What aesthetic surgeries does Dr. Badawi perform?",
      answer: "Dr. Badawi performs a full range of procedures including rhinoplasty, breast augmentation, liposuction, facelifts, and tummy tucks."
    }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
