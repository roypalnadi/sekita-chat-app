import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // tidak disarankan, tapi bisa dipakai untuk semua host
                pathname: '/**',
            },
        ],
    },
    /* config options here */
};

export default nextConfig;
