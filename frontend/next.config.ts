import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly use webpack for production builds.
  // Next.js 16 defaults to Turbopack, which has a known single-worker
  // prerendering bug with /_global-error on cold CI builds.
  turbopack: undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
