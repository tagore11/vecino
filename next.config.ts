import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@coinbase/onchainkit',
    '@rainbow-me/rainbowkit',
  ],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint bloğunu tamamen kaldırdık çünkü Next.js 16'da desteklenmiyor
};

export default nextConfig;