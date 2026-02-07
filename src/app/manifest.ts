import type { MetadataRoute } from 'next';
import { staticSanityFetch } from '@/sanity/lib/fetch';
import { SEO_META_DATA_QUERY } from '@/sanity/lib/queries';
import type { SEO_META_DATA_QUERYResult } from '@/sanity/types';

/**
 * Web App Manifest - Enables "Add to Home Screen" functionality
 *
 * This manifest allows users to install the website as a Progressive Web App (PWA)
 * on mobile devices, providing an app-like experience.
 *
 * - name & short_name: Fetched from Sanity CMS (SEO Meta Data > Site Title)
 * - description: Fetched from Sanity CMS (SEO Meta Data > Site Description)
 * - Theme colors: Hardcoded below (must match brand colors in globals.css)
 *
 * ⚠️ IMPORTANT: Theme colors must match brand colors in globals.css
 * When changing brand colors in globals.css, update these values too:
 *   - THEME_COLOR: should match --color-brand-primary
 *   - BACKGROUND_COLOR: should match --color-brand-charcoal
 */

// Theme colors - MUST be kept in sync with globals.css brand colors
// See: src/app/globals.css @theme section
const THEME_COLOR = '#ff6600'; // --color-brand-primary
const BACKGROUND_COLOR = '#282828'; // --color-brand-charcoal

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Fetch site title and description from Sanity
  const { data: seoMetaData } = await staticSanityFetch<SEO_META_DATA_QUERYResult>({
    query: SEO_META_DATA_QUERY,
    tags: ['sanity', 'seoMetaData'],
  });

  const siteTitle = seoMetaData?.siteTitle || 'Website';
  const siteDescription = seoMetaData?.siteDescription || '';

  return {
    name: siteTitle,
    short_name: siteTitle,
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      {
        src: '/icon2.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon3.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
