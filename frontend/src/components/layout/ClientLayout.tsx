'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Toaster = dynamic(
  () => import('sonner').then((mod) => mod.Toaster),
  { ssr: false }
);

const VisitTracker = dynamic(
  () => import('@/components/VisitTracker').then((mod) => mod.VisitTracker),
  { ssr: false }
);

export function ClientLayout() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <VisitTracker />
    </>
  );
}
