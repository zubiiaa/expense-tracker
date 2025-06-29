import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Enable external packages for server components
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
