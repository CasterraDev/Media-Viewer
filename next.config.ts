import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/getMedia**',
      },
    ],
    formats: ['image/webp'],
  },
};

export default nextConfig;
