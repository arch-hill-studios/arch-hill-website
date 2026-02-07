import { staticSanityFetch, type FetchFn } from '@/sanity/lib/fetch';
import { TERMS_AND_CONDITIONS_QUERY, PRIVACY_POLICY_QUERY } from '@/sanity/lib/queries';
import type { TERMS_AND_CONDITIONS_QUERYResult, PRIVACY_POLICY_QUERYResult } from '@/sanity/types';

export async function getTermsAndConditions(fetchFn: FetchFn = staticSanityFetch): Promise<TERMS_AND_CONDITIONS_QUERYResult> {
  const { data } = await fetchFn({
    query: TERMS_AND_CONDITIONS_QUERY,
    tags: ['sanity', 'termsAndConditions'],
  });
  return data as TERMS_AND_CONDITIONS_QUERYResult;
}

export async function getPrivacyPolicy(fetchFn: FetchFn = staticSanityFetch): Promise<PRIVACY_POLICY_QUERYResult> {
  const { data } = await fetchFn({
    query: PRIVACY_POLICY_QUERY,
    tags: ['sanity', 'privacyPolicy'],
  });
  return data as PRIVACY_POLICY_QUERYResult;
}
