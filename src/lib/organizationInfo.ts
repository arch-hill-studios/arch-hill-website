/**
 * Organization Info Utilities
 *
 * Single source of truth for organization name and description.
 * Priority: Sanity CMS data > Default values defined here
 *
 * Usage:
 * - For server components/actions that need to fetch: use fetchOrganizationName() / fetchOrganizationDescription()
 * - For components that already have businessContactInfo: use getOrganizationName(info) / getOrganizationDescription(info)
 * - For static contexts (metadata exports, schemas): use DEFAULT_ORGANIZATION_NAME / DEFAULT_ORGANIZATION_DESCRIPTION
 *
 * Note: Server-side imports (like @/actions) are dynamically imported inside async functions
 * to avoid breaking Sanity schema extraction which doesn't support React Server Components.
 */

import type { BUSINESS_CONTACT_INFO_QUERYResult } from '@/sanity/types';

// Default organization values - used as fallback when Sanity data is unavailable
// Primary source is Sanity CMS: Site Management > Business & Contact Info
export const DEFAULT_ORGANIZATION_NAME = 'Temporary Company Name Ltd';
export const DEFAULT_ORGANIZATION_DESCRIPTION =
  "This is the default description for Temporary Company Name Ltd. Please update it in the Sanity CMS Business & Contact Info section to reflect your organization's details.";

/**
 * Get organization name from businessContactInfo with fallback to default.
 * Use this when you already have the businessContactInfo data available.
 */
export function getOrganizationName(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.organizationName || DEFAULT_ORGANIZATION_NAME;
}

/**
 * Get organization description from businessContactInfo with fallback to default.
 * Use this when you already have the businessContactInfo data available.
 */
export function getOrganizationDescription(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.organizationDescription || DEFAULT_ORGANIZATION_DESCRIPTION;
}

/**
 * Fetch organization name from Sanity with fallback to default.
 * Use this in server components/actions when you need the name but don't have businessContactInfo.
 */
export async function fetchOrganizationName(): Promise<string> {
  const { getBusinessContactInfo } = await import('@/actions');
  const businessContactInfo = await getBusinessContactInfo();
  return getOrganizationName(businessContactInfo);
}

/**
 * Fetch organization description from Sanity with fallback to default.
 * Use this in server components/actions when you need the description but don't have businessContactInfo.
 */
export async function fetchOrganizationDescription(): Promise<string> {
  const { getBusinessContactInfo } = await import('@/actions');
  const businessContactInfo = await getBusinessContactInfo();
  return getOrganizationDescription(businessContactInfo);
}

/**
 * Fetch both organization name and description from Sanity with fallbacks.
 * Use this when you need both values to avoid multiple fetches.
 */
export async function fetchOrganizationInfo(): Promise<{
  name: string;
  description: string;
}> {
  const { getBusinessContactInfo } = await import('@/actions');
  const businessContactInfo = await getBusinessContactInfo();
  return {
    name: getOrganizationName(businessContactInfo),
    description: getOrganizationDescription(businessContactInfo),
  };
}

// ============================================================================
// Logo Helper
// Returns the logo image if set, otherwise null (no logo rendered)
// ============================================================================

/**
 * Get logo from businessContactInfo.
 * Returns the image data if set, otherwise null.
 * Used in Header/Footer to display the business logo.
 * If null, no logo is rendered (valid scenario for text-only branding).
 */
export function getLogo(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
) {
  return businessContactInfo?.logo || null;
}

// ============================================================================
// Brand Display Image Helper
// Returns the brand text image if set, otherwise null (falls back to org name)
// ============================================================================

/**
 * Get brand text image from businessContactInfo.
 * Returns the image data if set, otherwise null.
 * Used in Header/Footer to display styled brand text as an image.
 * If null, components should fall back to displaying organizationName as text.
 */
export function getBrandTextImage(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
) {
  return businessContactInfo?.brandTextImage || null;
}

// ============================================================================
// Contact Info Helpers (Email, Phone, Address)
// These return empty strings when data is not available (no defaults)
// ============================================================================

/**
 * Get organization email from businessContactInfo.
 * Returns empty string if not set.
 */
export function getOrganizationEmail(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.organizationEmail || '';
}

/**
 * Get organization email as mailto link.
 * Returns empty string if email not set.
 */
export function getOrganizationEmailLink(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  const email = getOrganizationEmail(businessContactInfo);
  return email ? `mailto:${email}` : '';
}

/**
 * Get organization phone from businessContactInfo.
 * Returns empty string if not set.
 */
export function getOrganizationPhone(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.organizationPhone || '';
}

/**
 * Get organization phone as tel link (removes spaces).
 * Returns empty string if phone not set.
 */
export function getOrganizationPhoneLink(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  const phone = getOrganizationPhone(businessContactInfo);
  return phone ? `tel:${phone.replace(/\s+/g, '')}` : '';
}

/**
 * Get organization address from businessContactInfo.
 * Returns empty string if not set.
 */
export function getOrganizationAddress(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.organizationAddress || '';
}

/**
 * Get Google Maps link from businessContactInfo.
 * Returns empty string if not set.
 */
export function getOrganizationAddressLink(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.googleMapsLink || '';
}

/**
 * Get Google Maps embed code from businessContactInfo.
 * Returns empty string if not set.
 */
export function getGoogleMapsEmbedCode(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.googleMapsEmbedCode || '';
}

// ============================================================================
// Business Location & SEO Helpers
// These return empty strings/objects/arrays when data is not available (no defaults)
// ============================================================================

export interface BusinessLocation {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressRegion: string;
  addressCountry: string;
  latitude: string;
  longitude: string;
  regionCode: string;
}

/**
 * Get business location data from businessContactInfo.
 * Returns object with empty strings for all fields if not set.
 */
export function getBusinessLocation(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): BusinessLocation {
  const location = businessContactInfo?.businessLocation;
  return {
    streetAddress: location?.streetAddress || '',
    addressLocality: location?.addressLocality || '',
    postalCode: location?.postalCode || '',
    addressRegion: location?.addressRegion || '',
    addressCountry: location?.addressCountry || '',
    latitude: location?.latitude || '',
    longitude: location?.longitude || '',
    regionCode: location?.regionCode || '',
  };
}

/**
 * Get business hours from businessContactInfo.
 * Returns empty string if not set.
 */
export function getBusinessHours(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.businessHours || '';
}

/**
 * Get price range from businessContactInfo.
 * Returns empty string if not set.
 */
export function getPriceRange(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): string {
  return businessContactInfo?.priceRange || '';
}

export interface ServiceArea {
  type: string;
  name: string;
}

/**
 * Get service areas from businessContactInfo.
 * Returns empty array if not set.
 */
export function getServiceAreas(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
): ServiceArea[] {
  const areas = businessContactInfo?.serviceAreas;
  if (!areas || !Array.isArray(areas)) {
    return [];
  }
  return areas.map((area) => ({
    type: area.areaType || '',
    name: area.areaName || '',
  }));
}
