'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-bone">
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-serif text-secondary mb-4">A critical error occurred</h2>
          <p className="text-secondary/60 mb-8 max-w-md">
            The application encountered a serious problem. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            className="bg-primary text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
