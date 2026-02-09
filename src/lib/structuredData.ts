import { urlFor } from '@/sanity/lib/image';
import type { SEO_META_DATA_QUERY_RESULT, COMPANY_LINKS_QUERY_RESULT, BUSINESS_CONTACT_INFO_QUERY_RESULT } from '@/sanity/types';
import type { ImageObjectData } from '@/lib/imageUtils';
import {
  getOrganizationName,
  getOrganizationDescription,
  getOrganizationEmail,
  getOrganizationPhone,
  getOrganizationAddress,
  getBusinessLocation,
  getBusinessHours,
  getPriceRange,
  getServiceAreas,
} from '@/lib/organizationInfo';

export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: string;
  sameAs?: string[];
}

export interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string;
  priceRange?: string;
  image?: string;
  logo?: string;
  areaServed?: ReadonlyArray<{
    readonly type: string;
    readonly name: string;
  }>;
  sameAs?: readonly string[];
}

export interface WebSiteData {
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

export interface BlogPostData {
  headline: string;
  description?: string;
  image?: string | ImageObjectData;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    type?: string;
  };
  publisher: OrganizationData;
  url: string;
}

export interface ArticleData {
  headline: string;
  description?: string;
  image?: string | ImageObjectData;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    type?: string;
  };
  publisher: OrganizationData;
  url: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateImageObjectSchema(data: ImageObjectData) {
  return {
    '@type': 'ImageObject',
    url: data.url,
    ...(data.width && { width: data.width }),
    ...(data.height && { height: data.height }),
    ...(data.alt && { description: data.alt }),
    ...(data.caption && { caption: data.caption }),
  };
}

export function generateOrganizationSchema(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.email && { email: `mailto:${data.email}` }),
    ...(data.telephone && { telephone: data.telephone }),
    ...(data.address && { address: data.address }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };
}

export function generateLocalBusinessSchema(data: LocalBusinessData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    url: data.url,
    telephone: data.telephone,
    email: `mailto:${data.email}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      postalCode: data.address.postalCode,
      addressRegion: data.address.addressRegion,
      addressCountry: data.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    },
    ...(data.openingHours && { openingHours: data.openingHours }),
    ...(data.priceRange && { priceRange: data.priceRange }),
    ...(data.image && { image: data.image }),
    ...(data.logo && { logo: data.logo }),
    ...(data.areaServed &&
      data.areaServed.length > 0 && {
        areaServed: data.areaServed.map((area) => ({
          '@type': area.type,
          name: area.name,
        })),
      }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };
}

export function generateWebSiteSchema(data: WebSiteData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    ...(data.description && { description: data.description }),
    ...(data.potentialAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: data.potentialAction.target,
        'query-input': data.potentialAction.queryInput,
      },
    }),
  };
}

export function generateBlogPostSchema(data: BlogPostData) {
  const imageSchema = data.image
    ? typeof data.image === 'string'
      ? data.image
      : generateImageObjectSchema(data.image)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.headline,
    ...(data.description && { description: data.description }),
    ...(imageSchema && { image: imageSchema }),
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': data.author.type || 'Person',
      name: data.author.name,
    },
    publisher: generateOrganizationSchema(data.publisher),
    url: data.url,
  };
}

export function generateArticleSchema(data: ArticleData) {
  const imageSchema = data.image
    ? typeof data.image === 'string'
      ? data.image
      : generateImageObjectSchema(data.image)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    ...(data.description && { description: data.description }),
    ...(imageSchema && { image: imageSchema }),
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': data.author.type || 'Person',
      name: data.author.name,
    },
    publisher: generateOrganizationSchema(data.publisher),
    url: data.url,
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates FAQPage structured data for rich snippets in search results.
 * Use this on FAQ pages to enable FAQ rich results in Google.
 */
export function generateFAQPageSchema(items: FAQItem[]) {
  if (!items || items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Generates Organization data from site settings.
 * Optionally includes social media profiles from company links for the sameAs field.
 */
export function getOrganizationDataFromSeoMetaData(
  seoMetaData: SEO_META_DATA_QUERY_RESULT,
  baseUrl: string,
  companyLinks?: COMPANY_LINKS_QUERY_RESULT | null,
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERY_RESULT | null
): OrganizationData {
  const socialMediaUrls = getSocialMediaUrlsFromCompanyLinks(companyLinks ?? null);

  const email = getOrganizationEmail(businessContactInfo);
  const telephone = getOrganizationPhone(businessContactInfo);
  const address = getOrganizationAddress(businessContactInfo);

  return {
    name: seoMetaData?.siteTitle || getOrganizationName(businessContactInfo),
    url: baseUrl,
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(address && { address }),
    ...(seoMetaData?.siteDescription && { description: seoMetaData.siteDescription }),
    ...(seoMetaData?.defaultOgImage && {
      logo: urlFor(seoMetaData.defaultOgImage).width(512).height(512).url(),
    }),
    ...(socialMediaUrls.length > 0 && { sameAs: socialMediaUrls }),
  };
}

export function getWebSiteDataFromSeoMetaData(
  seoMetaData: SEO_META_DATA_QUERY_RESULT,
  baseUrl: string,
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERY_RESULT | null
): WebSiteData {
  return {
    name: seoMetaData?.siteTitle || getOrganizationName(businessContactInfo),
    url: baseUrl,
    ...(seoMetaData?.siteDescription && { description: seoMetaData.siteDescription }),
  };
}

/**
 * Extracts social media profile URLs from Sanity company links data.
 * Used for the sameAs property in structured data schemas.
 */
export function getSocialMediaUrlsFromCompanyLinks(
  companyLinks: COMPANY_LINKS_QUERY_RESULT | null
): string[] {
  if (!companyLinks || companyLinks._type !== 'companyLinks') {
    return [];
  }

  const socialLinksArray = companyLinks.companyLinks?.socialLinksArray;
  if (!Array.isArray(socialLinksArray)) {
    return [];
  }

  return socialLinksArray
    .filter((link): link is typeof link & { url: string } => typeof link.url === 'string')
    .map((link) => link.url);
}

/**
 * Generates LocalBusiness structured data from SEO meta data and business info.
 *
 * Business-specific data (location, hours, service areas) is managed in Sanity CMS
 * under Site Management > Business & Contact Info for content editor control.
 *
 * Social media profiles are pulled from Sanity Company Links.
 */
export function getLocalBusinessDataFromSeoMetaData(
  seoMetaData: SEO_META_DATA_QUERY_RESULT,
  baseUrl: string,
  companyLinks?: COMPANY_LINKS_QUERY_RESULT | null,
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERY_RESULT | null
): LocalBusinessData {
  const socialMediaUrls = getSocialMediaUrlsFromCompanyLinks(companyLinks ?? null);

  const email = getOrganizationEmail(businessContactInfo);
  const telephone = getOrganizationPhone(businessContactInfo);
  const location = getBusinessLocation(businessContactInfo);
  const businessHours = getBusinessHours(businessContactInfo);
  const priceRange = getPriceRange(businessContactInfo);
  const serviceAreas = getServiceAreas(businessContactInfo);

  return {
    name: seoMetaData?.siteTitle || getOrganizationName(businessContactInfo),
    description: seoMetaData?.siteDescription || getOrganizationDescription(businessContactInfo),
    url: baseUrl,
    telephone: telephone || '',
    email: email || '',
    address: {
      streetAddress: location.streetAddress,
      addressLocality: location.addressLocality,
      postalCode: location.postalCode,
      addressRegion: location.addressRegion,
      addressCountry: location.addressCountry,
    },
    geo: {
      latitude: parseFloat(location.latitude) || 0,
      longitude: parseFloat(location.longitude) || 0,
    },
    openingHours: businessHours,
    ...(priceRange !== '' && { priceRange }),
    ...(seoMetaData?.defaultOgImage && {
      image: urlFor(seoMetaData.defaultOgImage).width(1200).height(630).url(),
    }),
    ...(seoMetaData?.defaultOgImage && {
      logo: urlFor(seoMetaData.defaultOgImage).width(512).height(512).url(),
    }),
    areaServed: serviceAreas,
    sameAs: socialMediaUrls,
  };
}

export function generateStructuredDataScript(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
