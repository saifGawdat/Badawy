"use client"

import React from 'react';
import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
      <h1 className="text-6xl font-serif text-primary mb-4">404</h1>
      <h2 className="text-2xl font-serif text-secondary mb-6">Page Not Found</h2>
      <p className="text-secondary/60 mb-10 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-primary/20"
      >
        Go back home
      </Link>
    </div>
  );
}
