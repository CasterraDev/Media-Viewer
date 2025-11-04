import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
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
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
