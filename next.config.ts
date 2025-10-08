import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/getMedia**',
      },
      {
        pathname: '/api/getFileStream**',
      },
    ],
    formats: ['image/webp'],
    qualities: [100, 75, 50, 25]
  },
};

export default nextConfig;
