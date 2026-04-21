'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';

const Toaster = dynamic(
  () => import('sonner').then((mod) => mod.Toaster),
  { ssr: false }
);

const VisitTracker = dynamic(
  () => import('@/components/VisitTracker').then((mod) => mod.VisitTracker),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
        <Toaster position="top-right" richColors />
        <VisitTracker />
      </LanguageProvider>
    </AuthProvider>
  );
}
