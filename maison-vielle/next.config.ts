import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Generate HTML/CSS/JS that Hostinger can serve without a Node or Worker runtime.
  output: "export",
  distDir: "dist",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
