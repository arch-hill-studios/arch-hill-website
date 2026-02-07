import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Modern JavaScript - reduce polyfills for better performance
  transpilePackages: [],

  // CSS and JavaScript optimization
  experimental: {
    optimizeCss: true,
    cssChunking: 'strict',
  },

  // Turbopack configuration (required for Next.js 16+)
  // Empty config acknowledges Turbopack usage alongside webpack config
  turbopack: {},

  // Bundle optimization
  webpack: (config, { isServer }) => {
    // Optimize CSS chunking for better loading performance
    if (!isServer && config.optimization.splitChunks) {
      // Ensure splitChunks is an object, not false
      if (typeof config.optimization.splitChunks === 'object') {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
          },
        };
      }
    }

    return config;
  },
};

export default nextConfig;
