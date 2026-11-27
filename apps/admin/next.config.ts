import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@alkok/ui", "@alkok/core"],
  poweredByHeader: false,
};

export default nextConfig;
