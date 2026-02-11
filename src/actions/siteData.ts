import { staticSanityFetch, type FetchFn } from '@/sanity/lib/fetch';
import { HEADER_QUERY, FOOTER_QUERY, SEO_META_DATA_QUERY, BUSINESS_CONTACT_INFO_QUERY, COMPANY_LINKS_QUERY, CONTACT_FORM_SETTINGS_QUERY, LEGAL_PAGES_VISIBILITY_QUERY, CONTACT_CONFIRMATION_EMAIL_QUERY } from '@/sanity/lib/queries';
import type { FOOTER_QUERY_RESULT, HEADER_QUERY_RESULT, SEO_META_DATA_QUERY_RESULT, BUSINESS_CONTACT_INFO_QUERY_RESULT, COMPANY_LINKS_QUERY_RESULT, CONTACT_FORM_SETTINGS_QUERY_RESULT, LEGAL_PAGES_VISIBILITY_QUERY_RESULT, CONTACT_CONFIRMATION_EMAIL_QUERY_RESULT } from '@/sanity/types';

// Header actions
export async function getHeader(fetchFn: FetchFn = staticSanityFetch): Promise<HEADER_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: HEADER_QUERY,
    tags: ['sanity', 'header'],
  });

  return data as HEADER_QUERY_RESULT | null;
}

// Footer actions
export async function getFooter(fetchFn: FetchFn = staticSanityFetch): Promise<FOOTER_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: FOOTER_QUERY,
    tags: ['sanity', 'footer'],
  });

  return data as FOOTER_QUERY_RESULT | null;
}

// SEO and Meta Data actions
export async function getSeoMetaData(fetchFn: FetchFn = staticSanityFetch): Promise<SEO_META_DATA_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: SEO_META_DATA_QUERY,
    tags: ['sanity', 'seoMetaData'],
  });

  return data as SEO_META_DATA_QUERY_RESULT | null;
}

// Business & Contact Info actions
export async function getBusinessContactInfo(fetchFn: FetchFn = staticSanityFetch): Promise<BUSINESS_CONTACT_INFO_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: BUSINESS_CONTACT_INFO_QUERY,
    tags: ['sanity', 'businessContactInfo'],
  });

  return data as BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
}

// Company Links actions
export async function getCompanyLinks(fetchFn: FetchFn = staticSanityFetch): Promise<COMPANY_LINKS_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: COMPANY_LINKS_QUERY,
    tags: ['sanity', 'companyLinks'],
  });

  return data as COMPANY_LINKS_QUERY_RESULT | null;
}

// Contact Form Settings actions
export async function getContactFormSettings(fetchFn: FetchFn = staticSanityFetch): Promise<CONTACT_FORM_SETTINGS_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: CONTACT_FORM_SETTINGS_QUERY,
    tags: ['sanity', 'contactFormSettings'],
  });

  return data as CONTACT_FORM_SETTINGS_QUERY_RESULT | null;
}

// Legal Pages Visibility actions
export async function getLegalPagesVisibility(fetchFn: FetchFn = staticSanityFetch): Promise<LEGAL_PAGES_VISIBILITY_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: LEGAL_PAGES_VISIBILITY_QUERY,
    tags: ['sanity', 'termsAndConditions', 'privacyPolicy'],
  });

  return data as LEGAL_PAGES_VISIBILITY_QUERY_RESULT | null;
}

// Contact Confirmation Email actions
export async function getContactConfirmationEmail(fetchFn: FetchFn = staticSanityFetch): Promise<CONTACT_CONFIRMATION_EMAIL_QUERY_RESULT | null> {
  const { data } = await fetchFn({
    query: CONTACT_CONFIRMATION_EMAIL_QUERY,
    tags: ['sanity', 'contactConfirmationEmail'],
  });

  return data as CONTACT_CONFIRMATION_EMAIL_QUERY_RESULT | null;
}

// Unified PageBuilder data fetcher
// This fetches all global data needed by PageBuilder components in a single call
// When adding new global data (e.g., FAQ settings), add it here and to the return type
export interface PageBuilderData {
  seoMetaData: SEO_META_DATA_QUERY_RESULT | null;
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
  companyLinks: COMPANY_LINKS_QUERY_RESULT | null;
  contactFormSettings: CONTACT_FORM_SETTINGS_QUERY_RESULT | null;
}

export async function getPageBuilderData(fetchFn: FetchFn = staticSanityFetch): Promise<PageBuilderData> {
  const [seoMetaData, businessContactInfo, companyLinks, contactFormSettings] = await Promise.all([
    getSeoMetaData(fetchFn),
    getBusinessContactInfo(fetchFn),
    getCompanyLinks(fetchFn),
    getContactFormSettings(fetchFn),
  ]);

  return {
    seoMetaData,
    businessContactInfo,
    companyLinks,
    contactFormSettings,
  };
}
