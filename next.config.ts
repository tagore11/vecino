import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@coinbase/onchainkit',
    '@rainbow-me/rainbowkit',
  ],
  // This tells Next.js 16 we know what we are doing
  turbopack: {}, 
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;