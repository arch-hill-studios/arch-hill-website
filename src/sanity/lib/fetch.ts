/**
 * Static-friendly Sanity fetch function for public-facing pages.
 *
 * CRITICAL: This function does NOT call draftMode() or cookies(),
 * which means pages using it are eligible for Next.js Full Route Cache
 * (truly static, served from CDN).
 *
 * For live preview (draft mode), use defineLive's sanityFetch from ./live.ts instead.
 * Action functions accept an optional fetchFn parameter to switch between the two.
 */
import { client } from './client';
import { token } from './token';

const authenticatedClient = client.withConfig({ token, useCdn: false });

export type SanityFetchParams = Record<string, unknown>;

export interface SanityFetchOptions {
  query: string;
  params?: SanityFetchParams | Promise<SanityFetchParams>;
  tags?: string[];
}

/**
 * Fetch function type compatible with both staticSanityFetch and defineLive's sanityFetch.
 * Action functions accept this type to allow switching between static and live fetching.
 *
 * Only includes fields used by action functions (query, params, tags).
 * defineLive's sanityFetch accepts these fields (plus extras), so it's compatible.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchFn = (options: { query: string; params?: any; tags?: string[]; [key: string]: unknown }) => Promise<{ data: unknown }>;

export async function staticSanityFetch<T = unknown>(
  options: SanityFetchOptions
): Promise<{ data: T }> {
  const { query, params = {}, tags = ['sanity'] } = options;

  // In development, don't cache so changes appear immediately on refresh.
  // In production, cache indefinitely and rely on webhook-triggered revalidateTag().
  const isDev = process.env.NODE_ENV === 'development';

  const data = await authenticatedClient.fetch<T>(query, await params, {
    next: isDev
      ? { revalidate: 0 }
      : { tags, revalidate: false },
  });

  return { data };
}
