import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Everything Next.js generates lives in dist: the static export at its root (upload this to Hostinger)
  // and the dev server's isolated build in dist/dev, which is never verified or packaged.
  output: "export",
  distDir: "dist",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
