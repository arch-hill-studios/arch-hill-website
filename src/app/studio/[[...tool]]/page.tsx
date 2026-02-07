/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import config from '../../../../sanity.config';

// Disable SSR for Sanity Studio to prevent hydration mismatches
// caused by styled-components generating different class names on server/client
const NextStudio = dynamic(() => import('next-sanity/studio').then(mod => mod.NextStudio), {
  ssr: false,
});

const StudioPage = () => {
  return <NextStudio config={config} />;
};

export default StudioPage;
