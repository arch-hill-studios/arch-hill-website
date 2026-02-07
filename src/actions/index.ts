// Pages actions
export { getHomePageHero, getHomePageSections, getPageBySlug, getAllPages } from './pages';

// Site data actions
export { getHeader, getFooter, getSeoMetaData, getBusinessContactInfo, getCompanyLinks, getContactFormSettings, getLegalPagesVisibility, getContactGeneralContent, getContactConfirmationEmail, getPageBuilderData } from './siteData';
export type { PageBuilderData } from './siteData';

// Legal actions
export { getTermsAndConditions, getPrivacyPolicy } from './legal';

// FAQ actions
export { getFaqPage } from './faq';

// Types
export type {
  HOME_PAGE_HERO_QUERYResult,
  HOME_PAGE_SECTIONS_QUERYResult,
  PAGE_QUERYResult,
} from './types';

// Re-export FetchFn type for convenience
export type { FetchFn } from '@/sanity/lib/fetch';
