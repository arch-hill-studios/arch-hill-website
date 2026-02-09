import { staticSanityFetch, type FetchFn } from '@/sanity/lib/fetch';
import { TERMS_AND_CONDITIONS_QUERY, PRIVACY_POLICY_QUERY } from '@/sanity/lib/queries';
import type { TERMS_AND_CONDITIONS_QUERY_RESULT, PRIVACY_POLICY_QUERY_RESULT } from '@/sanity/types';

export async function getTermsAndConditions(fetchFn: FetchFn = staticSanityFetch): Promise<TERMS_AND_CONDITIONS_QUERY_RESULT> {
  const { data } = await fetchFn({
    query: TERMS_AND_CONDITIONS_QUERY,
    tags: ['sanity', 'termsAndConditions'],
  });
  return data as TERMS_AND_CONDITIONS_QUERY_RESULT;
}

export async function getPrivacyPolicy(fetchFn: FetchFn = staticSanityFetch): Promise<PRIVACY_POLICY_QUERY_RESULT> {
  const { data } = await fetchFn({
    query: PRIVACY_POLICY_QUERY,
    tags: ['sanity', 'privacyPolicy'],
  });
  return data as PRIVACY_POLICY_QUERY_RESULT;
}
