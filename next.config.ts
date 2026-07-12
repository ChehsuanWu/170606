import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensures the Prisma query engine binary (generated into src/generated/prisma)
  // is included in the serverless function bundle on platforms like Vercel.
  outputFileTracingIncludes: {
    "/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
