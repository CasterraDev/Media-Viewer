import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/getMedia**',
      },
    ],
  },
};

export default nextConfig;
