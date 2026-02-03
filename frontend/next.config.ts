import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: isProd ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  // Ensure we use the correct base path for GitHub Pages
  basePath: isProd ? '/med-crm' : '',
  assetPrefix: isProd ? '/med-crm' : '',
  trailingSlash: true,
};

export default nextConfig;
