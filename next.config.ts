import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    // For all pages and API routes, include Prisma generated client folder
    "**/*": ["./prisma/app/generated/**/*"],
  },
  // webpack(config) {
  //   // Add '@prisma/client' as external to avoid bundling issues
  //   config.externals = config.externals || [];
  //   config.externals.push("@prisma/client");
  //   return config;
  // },  // Optional: standalone output for better serverless compatibility
  output: process.env.NODE_ENV === "production" ? undefined : "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dashi-restaurant-menu.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
