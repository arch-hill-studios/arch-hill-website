import { staticSanityFetch, type FetchFn } from '@/sanity/lib/fetch';
import { FAQ_PAGE_QUERY } from '@/sanity/lib/queries';
import type { FAQ_PAGE_QUERYResult } from '@/sanity/types';

export async function getFaqPage(fetchFn: FetchFn = staticSanityFetch): Promise<FAQ_PAGE_QUERYResult> {
  const { data } = await fetchFn({
    query: FAQ_PAGE_QUERY,
    tags: ['sanity', 'faqPage'],
  });
  return data as FAQ_PAGE_QUERYResult;
}
