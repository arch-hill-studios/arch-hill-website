import React from 'react';
import { Bebas_Neue, Inter } from 'next/font/google';
import '@/app/globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import { fetchOrganizationInfo } from '@/lib/organizationInfo';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
  display: 'swap',
});

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isProd = process.env.NEXT_PUBLIC_ENV === 'production';
  // Use consistent baseUrl - will use NEXT_PUBLIC_BASE_URL if set, otherwise SITE_CONFIG.PRODUCTION_DOMAIN
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_CONFIG.PRODUCTION_DOMAIN;

  // Only show robots meta tag if:
  // 1. NOT in production (always hide), OR
  // 2. In production AND maintenance mode is OFF
  const shouldHideFromRobots = !isProd || process.env.MAINTENANCE_MODE_ENABLED === 'true';

  // Fetch organization info from Sanity (with fallback to defaults)
  const { name: orgName, description: orgDescription } = await fetchOrganizationInfo();

  // Basic organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: orgName,
    url: baseUrl,
    description: orgDescription,
  };

  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {shouldHideFromRobots && <meta name='robots' content='noindex, nofollow' />}

        {/* Resource hints for performance */}
        <link rel='dns-prefetch' href='//cdn.sanity.io' />
        <link rel='preconnect' href='https://cdn.sanity.io' crossOrigin='anonymous' />

        {/* Critical CSS inline for faster LCP - Simplified for maintainability */}
        {/*
          ⚠️  IMPORTANT: Only essential layout styles are duplicated from src/app/globals.css
          ⚠️  When changing these critical values, update BOTH:
          ⚠️  1. This inline critical CSS (for performance)
          ⚠️  2. The corresponding styles in src/app/globals.css (for consistency)
          ⚠️
          ⚠️  DUPLICATED STYLES: header positioning, main padding, scroll padding, brand colors
        */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical layout-only styles - KEEP IN SYNC with globals.css */
            html {
              scroll-padding-top: 70px; /* matches h-[70px] header */
            }

            body { margin: 0; padding: 0; }

            /* Essential brand colors for immediate render */
            :root {
              --color-brand-primary: #6b1c1c;
              --color-brand-secondary: #1c2d6b;
            }
          `,
          }}
        />

        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${inter.className} ${bebasNeue.variable} text-body-base text-brand-muted overflow-x-hidden bg-brand-dark`}>
        {/* Fixed background image - contained to screen width with bottom fade. */}
        <div className='fixed inset-0 z-[-1] overflow-hidden' aria-hidden='true'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/body-background.png'
            alt=''
            className='block w-full h-auto brightness-100 md:brightness-70'
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
