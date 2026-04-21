'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bone p-6 text-center">
      <h2 className="text-3xl font-serif text-secondary mb-4">Something went wrong</h2>
      <p className="text-secondary/60 mb-8 max-w-md">
        An unexpected error occurred. We have been notified and are working on a fix.
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
      >
        Try again
      </button>
    </div>
  );
}
