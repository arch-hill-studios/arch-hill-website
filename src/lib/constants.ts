// Site configuration constants
// This file centralizes all site-specific configuration values
// Update these values when setting up a new project

// NOTE: Organization name and description are managed in @/lib/organizationInfo.ts
// Import DEFAULT_ORGANIZATION_NAME, DEFAULT_ORGANIZATION_DESCRIPTION, or use the helper functions from there

export const SITE_CONFIG = {
  // Production domain - reads from environment variable
  // Set NEXT_PUBLIC_BASE_URL in your .env.local file
  // IMPORTANT: Always use HTTPS (not HTTP) and no trailing slash for SEO consistency
  PRODUCTION_DOMAIN: process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com',

  // NOTE: Contact information (email, phone, address) and business details are now managed in Sanity CMS
  // Go to: Site Management → Business & Contact Info
  // This includes: Business Location, Business Hours, Price Range, Service Areas
  // Access in code via helper functions from @/lib/organizationInfo:
  //   - getOrganizationEmail(), getOrganizationPhone(), getOrganizationAddress()
  //   - getBusinessLocation(), getBusinessHours(), getPriceRange(), getServiceAreas()

  // Social Media Profiles - Managed in Sanity CMS under "Company Links > Social Links"
  // Social links are fetched from Sanity and used for LocalBusiness structured data (sameAs)
  // To add/edit social profiles, use the Sanity Studio: Company Links section

  // PWA Manifest Settings - Now managed in src/app/manifest.ts
  // Name and description are fetched from Sanity CMS (SEO Meta Data)
  // Theme colors are hardcoded in manifest.ts (must match globals.css brand colors)
} as const;

// Type-safe access to configuration values
export type SiteConfig = typeof SITE_CONFIG;
