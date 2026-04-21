import type { Metadata } from 'next';
import { Inter, Playfair_Display, Pinyon_Script } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

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

export const metadata: Metadata = {
  title: 'DR. MOSTAFA BADAWI | Plastic Surgeon',
  description: 'Premium Aesthetic Surgery & Cosmetic Procedures by Dr. Mostafa Badawi.',
  icons: {
    icon: '/logo9.png',
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
      className={`${inter.variable} ${playfair.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bone text-secondary selection:bg-primary/20">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
