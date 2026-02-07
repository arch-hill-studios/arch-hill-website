// AI Helper: This file contains all spacing constants used across the website for consistent spacing management.
// All spacing values are defined as Tailwind CSS classes with mobile-first responsive design.
// These constants should be imported and used instead of hardcoded spacing classes.

/**
 * Space under breadcrumb navigation before page content
 */
export const breadcrumbBottomSpacing = 'mb-8 md:mb-14';

/**
 * Space under page titles
 */
export const pageTitleBottomSpacing = 'mb-12 md:mb-18';

/**
 * SECTION CONTAINER PADDING SYSTEM
 * These padding values create internal spacing within sections while allowing backgrounds to extend edge-to-edge.
 * Applied via ContentContainer component inside PageSection/ContentWrapper.
 */

/**
 * Vertical padding for section containers (top and bottom)
 * Creates breathing room for content while keeping sections flush with each other
 */
export const sectionContainerPaddingY = 'py-20 md:py-32';

/**
 * Compact vertical padding for sections when useCompactGap is enabled
 */
export const sectionContainerPaddingYCompact = 'py-8 md:py-10';

/**
 * Horizontal padding for section containers (left and right)
 * Matches the Container component padding to keep content aligned
 */
export const sectionContainerPaddingX = 'px-6 sm:px-20';

/**
 * Combined container padding (all sides) - standard spacing
 */
export const sectionContainerPadding = `${sectionContainerPaddingY} ${sectionContainerPaddingX}`;

/**
 * Combined container padding (all sides) - compact spacing
 */
export const sectionContainerPaddingCompact = `${sectionContainerPaddingYCompact} ${sectionContainerPaddingX}`;

/**
 * Space after most content blocks (with exceptions defined in implementation)
 */
export const contentBlockBottomSpacing = 'mb-12 md:mb-16';

/**
 * Space above SubSection/SubSubSection when they have a sibling before them
 */
export const subSectionTopSpacing = 'mt-10 md:mt-14';

/**
 * Space after SubSection and SubSubSection titles
 */
export const subSectionTitleBottomSpacing = 'mb-4 md:mb-6';

/**
 * Space above and below closing cards on all pages
 */
export const closingCardSpacing = 'mt-16 md:mt-24';

/**
 * Max width for card like components (e.g. Cards, CTA Blog Posts etc)
 */
export const maxCardWidth = 'max-w-[650px]';

/**
 * Header height (must match Header.tsx and VerticalNav.tsx)
 * Mobile: 72px (18 * 4), Desktop: 80px (20 * 4)
 */
export const headerHeight = 'h-18 md:h-24';

/**
 * Header height in CSS calc format for use in max-height calculations
 * Uses small viewport height (svh) units to account for mobile browser UI
 */
export const headerHeightCalc = 'calc(80svh - 5rem)'; // 80svh minus 80px (desktop header)
export const maxHeightViewport = {
  // Max height of 80svh - 5rem (header height)
  maxHeight: 'calc(80svh - 5rem)',
  maxWidth: 'calc(80svh - 5rem)',
};

/**
 * Scroll margin top for anchor links to account for fixed header
 * Set to 0 because scroll-padding-top on html element already handles the offset
 * The html scroll-padding-top (4.5rem mobile, 6rem desktop) matches the header height
 */
export const anchorLinkScrollMarginTop = '';
