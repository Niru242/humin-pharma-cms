import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Removed "output: export" — we need server-side features for API calls
  trailingSlash: true,
  transpilePackages: ["@tabler/icons-react"],
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
