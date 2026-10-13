import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    // Export upload-ready files to dist, but keep development caches in .next.
    output: "export",
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next" : "dist",
    trailingSlash: true,
    images: { unoptimized: true },
  };
}
