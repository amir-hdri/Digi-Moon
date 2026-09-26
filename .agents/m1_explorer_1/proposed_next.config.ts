import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dijimoon.ir',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    // Turbopack builds automatically honor tsconfig.json compilerOptions.paths
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
