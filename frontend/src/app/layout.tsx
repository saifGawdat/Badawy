import type { Metadata } from 'next';
import { Inter, Playfair_Display, Pinyon_Script, Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import {
  SITE_URL,
  SITE_NAME,
  SITE_NAME_EN,
  GLOBAL_KEYWORDS,
  DEFAULT_OG_IMAGE,
} from '@/lib/seo';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

const pinyon = Pinyon_Script({
  variable: '--font-pinyon',
  subsets: ['latin'],
  weight: '400',
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | جراح التجميل`,
    template: `%s | د. مصطفى بدوي`,
  },
  description:
    'د. مصطفى بدوي — جراح تجميل متخصص في عمليات التجميل والترميم. احجز استشارتك الآن.',
  keywords: GLOBAL_KEYWORDS,
  authors: [{ name: 'Dr. Mostafa Badawi', url: SITE_URL }],
  creator: SITE_NAME_EN,
  publisher: SITE_NAME_EN,
  icons: { icon: '/logo9.png' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ar_EG',
    alternateLocale: 'en_US',
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@mostafabadawi',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      ar: `${SITE_URL}?lang=ar`,
      en: `${SITE_URL}?lang=en`,
      'x-default': SITE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${pinyon.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bone text-secondary selection:bg-primary/20">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
