import { NextResponse } from 'next/server';
import { getAllPages, getTermsAndConditions, getPrivacyPolicy, getFaqPage } from '@/actions';
import { SITE_CONFIG } from '@/lib/constants';
import type { ALL_PAGES_QUERY_RESULT } from '@/sanity/types';

// ISR: Cache for 1 hour, but allow immediate updates via webhook
export const revalidate = 3600;

type SitemapUrl = {
  url: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
};

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_CONFIG.PRODUCTION_DOMAIN;

  // Fetch all content from Sanity
  const [pages, termsAndConditions, privacyPolicy, faqPage] = await Promise.all([
    getAllPages(),
    getTermsAndConditions(),
    getPrivacyPolicy(),
    getFaqPage(),
  ]);

  const staticPages: SitemapUrl[] = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/faq', lastmod: faqPage?._updatedAt, changefreq: 'monthly', priority: '0.7' },
  ];

  // Add legal pages if they exist and are not hidden
  const legalPages: SitemapUrl[] = [];

  if (termsAndConditions && !termsAndConditions.hide) {
    legalPages.push({
      url: '/terms-and-conditions',
      lastmod: termsAndConditions._updatedAt,
      changefreq: 'monthly',
      priority: '0.5'
    });
  }

  if (privacyPolicy && !privacyPolicy.hide) {
    legalPages.push({
      url: '/privacy-policy',
      lastmod: privacyPolicy._updatedAt,
      changefreq: 'monthly',
      priority: '0.5'
    });
  }

  const dynamicUrls: SitemapUrl[] = [
    // Dynamic pages (exclude dev-test routes)
    ...(pages || [])
      .filter((page: ALL_PAGES_QUERY_RESULT[number]) => !page.slug?.current?.startsWith('dev-test'))
      .map((page: ALL_PAGES_QUERY_RESULT[number]) => ({
        url: `/${page.slug?.current}`,
        lastmod: page._updatedAt,
        changefreq: 'monthly',
        priority: '0.6'
      })),
  ];

  const allUrls = [...staticPages, ...legalPages, ...dynamicUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastmod, changefreq, priority }) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}