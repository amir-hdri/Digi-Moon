import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dijimoon.ir',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    // Turbopack builds automatically honor tsconfig.json compilerOptions.paths
  },
  experimental: {
    viewTransition: true,
    // Trim barrel-file parse/eval cost (lucide-react, framer-motion, zustand)
    // to shorten hydration long tasks on low-end mobile CPUs.
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'motion',
      'zustand',
      'clsx',
      'tailwind-merge',
    ],
  },
};

export default nextConfig;
