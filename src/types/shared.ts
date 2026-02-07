// Shared type definitions for components that use site settings
// Using empty object type for now - can be extended with properties in the future
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SiteSettingsProps {}

// Link system types - shared across CTA components
export interface DereferencedPage {
  _id: string;
  _type?: string;
  title?: string | null;
  slug?: {
    current?: string;
  } | null;
  pageType?: string;
  href?: string | null;
}

export interface InternalLinkReference {
  _ref: string;
  _type: 'reference';
}

export type InternalLinkType = InternalLinkReference | DereferencedPage | null;

// Block props utility types
export type BlockProps<T> = Omit<T, '_type' | '_key'> & {
  className?: string;
};

// Enhanced CTA block props with section linking support
export type CTABlockProps<T> = Omit<T, '_type' | '_key' | 'internalLink'> & {
  className?: string;
  internalLink?: InternalLinkType;
  pageSectionId?: string;
  computedHref?: string;
  inheritAlignment?: 'left' | 'center' | 'right';
};

// Common UI types
export type ButtonVariant = 'filled' | 'outline';

// Re-export text alignment types from sectionHelpers for consistency
export type { TextAlignment, TextAlignmentWithInherit } from '@/utils/sectionHelpers';
