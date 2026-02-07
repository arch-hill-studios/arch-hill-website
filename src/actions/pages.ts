import { staticSanityFetch, type FetchFn } from '@/sanity/lib/fetch';
import { HOME_PAGE_HERO_QUERY, HOME_PAGE_SECTIONS_QUERY, PAGE_QUERY, ALL_PAGES_QUERY } from '@/sanity/lib/queries';
import type { HOME_PAGE_HERO_QUERYResult, HOME_PAGE_SECTIONS_QUERYResult, PAGE_QUERYResult, ALL_PAGES_QUERYResult } from '@/sanity/types';

export async function getHomePageHero(fetchFn: FetchFn = staticSanityFetch): Promise<HOME_PAGE_HERO_QUERYResult | null> {
  const { data: hero } = await fetchFn({
    query: HOME_PAGE_HERO_QUERY,
    tags: ['sanity', 'homePageHero'],
  });

  return hero as HOME_PAGE_HERO_QUERYResult | null;
}

export async function getHomePageSections(fetchFn: FetchFn = staticSanityFetch): Promise<HOME_PAGE_SECTIONS_QUERYResult | null> {
  const { data: sections } = await fetchFn({
    query: HOME_PAGE_SECTIONS_QUERY,
    tags: ['sanity', 'homePageSections'],
  });

  return sections as HOME_PAGE_SECTIONS_QUERYResult | null;
}

export async function getPageBySlug(slug: string, fetchFn: FetchFn = staticSanityFetch): Promise<PAGE_QUERYResult | null> {
  const { data: page } = await fetchFn({
    query: PAGE_QUERY,
    params: { slug },
    tags: ['sanity', 'page'],
  });

  return page as PAGE_QUERYResult | null;
}

export async function getAllPages(fetchFn: FetchFn = staticSanityFetch): Promise<ALL_PAGES_QUERYResult> {
  const { data: pages } = await fetchFn({
    query: ALL_PAGES_QUERY,
    tags: ['sanity', 'page'],
  });

  return pages as ALL_PAGES_QUERYResult;
}
