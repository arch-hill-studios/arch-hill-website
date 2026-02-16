import type { NextConfig } from 'next';

// ---------------------------------------------------------------------------
// Security Headers
// ---------------------------------------------------------------------------
// These are applied via the `headers()` config below.
//
// Content-Security-Policy (CSP):
//   - Applied to frontend routes only (not /studio, which is a complex SPA
//     that would break under a strict CSP).
//   - Uses 'unsafe-inline' for script-src and style-src because Next.js App
//     Router injects inline scripts/styles for hydration and critical CSS.
//     For stronger XSS protection, migrate to a nonce-based CSP via
//     middleware in the future.
//   - frame-ancestors allows Sanity hosted Studio (*.sanity.studio) to embed
//     the frontend in its Presentation tool. This replaces X-Frame-Options,
//     which can't express multiple allowed origins.
// ---------------------------------------------------------------------------

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https://cdn.sanity.io data:",
  "font-src 'self'",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io",
  "frame-src https://www.youtube.com https://www.google.com",
  "media-src 'self' https://cdn.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self' https://*.sanity.studio",
  'upgrade-insecure-requests',
];

const contentSecurityPolicy = cspDirectives.join('; ');

/** Security headers applied to ALL routes (including /studio). */
const sharedSecurityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

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

  // Security & performance headers
  async headers() {
    return [
      // Frontend routes: full security headers including CSP
      {
        source: '/((?!studio).*)',
        headers: [
          ...sharedSecurityHeaders,
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        ],
      },
      // Sanity Studio: basic security headers only (no strict CSP —
      // Studio uses styled-components, dynamic imports, and eval-like
      // patterns that a strict policy would break)
      {
        source: '/studio/:path*',
        headers: sharedSecurityHeaders,
      },
    ];
  },

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
