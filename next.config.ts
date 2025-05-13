import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    // For all pages and API routes, include Prisma generated client folder
    '**/*': ['./prisma/app/generated/**/*'],
  },
  webpack(config) {
    // Add '@prisma/client' as external to avoid bundling issues
    config.externals = config.externals || [];
    config.externals.push('@prisma/client');
    return config;
  },
  // Optional: standalone output for better serverless compatibility
  output: 'standalone',
};

export default nextConfig;
