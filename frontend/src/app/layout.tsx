import type { Metadata } from "next";
import React from "react";
import { Inter, Playfair_Display, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "DR. MOSTAFA BADAWI | Plastic Surgeon",
  description: "Premium Aesthetic Surgery & Cosmetic Procedures by Dr. Mostafa Badawi.",
  icons: {
    icon: "/logo9.png",
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

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
        <AuthProvider>
          <LanguageProvider>
            {children}
            <ClientLayout />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
