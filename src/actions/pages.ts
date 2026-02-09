import { staticSanityFetch, type FetchFn } from '@/sanity/lib/fetch';
import { HOME_PAGE_HERO_QUERY, HOME_PAGE_SECTIONS_QUERY, PAGE_QUERY, ALL_PAGES_QUERY } from '@/sanity/lib/queries';
import type { HOME_PAGE_HERO_QUERY_RESULT, HOME_PAGE_SECTIONS_QUERY_RESULT, PAGE_QUERY_RESULT, ALL_PAGES_QUERY_RESULT } from '@/sanity/types';

export async function getHomePageHero(fetchFn: FetchFn = staticSanityFetch): Promise<HOME_PAGE_HERO_QUERY_RESULT | null> {
  const { data: hero } = await fetchFn({
    query: HOME_PAGE_HERO_QUERY,
    tags: ['sanity', 'homePageHero'],
  });

  return hero as HOME_PAGE_HERO_QUERY_RESULT | null;
}

export async function getHomePageSections(fetchFn: FetchFn = staticSanityFetch): Promise<HOME_PAGE_SECTIONS_QUERY_RESULT | null> {
  const { data: sections } = await fetchFn({
    query: HOME_PAGE_SECTIONS_QUERY,
    tags: ['sanity', 'homePageSections'],
  });

  return sections as HOME_PAGE_SECTIONS_QUERY_RESULT | null;
}

export async function getPageBySlug(slug: string, fetchFn: FetchFn = staticSanityFetch): Promise<PAGE_QUERY_RESULT | null> {
  const { data: page } = await fetchFn({
    query: PAGE_QUERY,
    params: { slug },
    tags: ['sanity', 'page'],
  });

  return page as PAGE_QUERY_RESULT | null;
}

export async function getAllPages(fetchFn: FetchFn = staticSanityFetch): Promise<ALL_PAGES_QUERY_RESULT> {
  const { data: pages } = await fetchFn({
    query: ALL_PAGES_QUERY,
    tags: ['sanity', 'page'],
  });

  return pages as ALL_PAGES_QUERY_RESULT;
}
