import { defineArrayMember } from 'sanity';

/**
 * Centralized Block List Definitions
 *
 * This file provides the single source of truth for all block lists used throughout
 * the Sanity schema. This ensures consistency and makes maintenance easier.
 *
 * IMPORTANT: When adding or removing block types, update this file only.
 * All components that accept block lists will automatically inherit the changes.
 *
 * NESTING RESTRICTIONS:
 * To prevent GROQ query depth issues and infinite recursion, we enforce strict nesting rules:
 * - Top-level content: Can contain twoColumnLayout and gridLayout
 * - Layout blocks (grid/twoColumn): Can contain content blocks but NOT nested layouts
 *
 * This ensures all internal link references are properly dereferenced in GROQ queries
 * without hitting recursion limits.
 */

/**
 * CONTENT_ONLY_BLOCKS - Pure content blocks without any layout components
 *
 * These blocks can be safely nested at any depth without causing GROQ issues.
 * Used inside cards and other deeply nested contexts.
 */
export const CONTENT_ONLY_BLOCKS = [
  defineArrayMember({ type: 'richText' }),
  defineArrayMember({ type: 'statement' }),
  defineArrayMember({ type: 'quote' }),
  defineArrayMember({ type: 'divider' }),
  defineArrayMember({ type: 'imageBlock' }),
  defineArrayMember({ type: 'imageGallery' }),
  defineArrayMember({ type: 'googleMap' }),
  defineArrayMember({ type: 'youTubeVideo' }),
  defineArrayMember({ type: 'ctaButton' }),
  defineArrayMember({ type: 'ctaCalloutLink' }),
  defineArrayMember({ type: 'card' }),
  defineArrayMember({ type: 'iconList' }),
  defineArrayMember({ type: 'detailedList' }),
  defineArrayMember({ type: 'blockListWithStats' }),
  defineArrayMember({ type: 'checkList' }),
  defineArrayMember({ type: 'itemList' }),
  defineArrayMember({ type: 'serviceCard' }),
  defineArrayMember({ type: 'companyLinksBlock' }),
  defineArrayMember({ type: 'expandingContent' }),
  defineArrayMember({ type: 'faqBlock' }),
  defineArrayMember({ type: 'serviceList' }),
];

/**
 * LAYOUT_CHILD_BLOCKS - Blocks allowed inside layout components (grid/twoColumn)
 *
 * Allows responsiveWrapper but NOT nested layout blocks to prevent deep nesting.
 */
export const LAYOUT_CHILD_BLOCKS = [
  ...CONTENT_ONLY_BLOCKS,
  defineArrayMember({ type: 'responsiveWrapper' }),
];

/**
 * STANDARD_BLOCK_LIST - The universal block list for top-level content
 *
 * This is the default block list that includes ALL content and layout blocks.
 * Use this for top-level page content and section content.
 *
 * Includes:
 * - Content blocks: richText, quote, divider, imageBlock, imageGallery, videos, widgets, CTAs, lists, forms
 * - Layout blocks: twoColumnLayout, gridLayout
 *
 * Does NOT include: Section blocks (pageSection, subSection, subSubSection)
 * - Sections have special nesting rules and are added separately where needed
 */
export const STANDARD_BLOCK_LIST = [
  ...CONTENT_ONLY_BLOCKS,
  // Layout Blocks - only allowed at top level
  defineArrayMember({ type: 'twoColumnLayout' }),
  defineArrayMember({ type: 'gridLayout' }),
  defineArrayMember({ type: 'responsiveWrapper' }),
  // Composite Blocks - self-contained sections that pull from global data
  defineArrayMember({ type: 'contactSection' }),
];

/**
 * PAGE_ROOT_BLOCK_LIST - For page builder root level only
 *
 * This is a restricted block list that ONLY allows PageSection and ContentWrapper
 * at the root page level. Individual content blocks cannot be added directly to pages.
 *
 * Includes:
 * - pageSection (full sections with headings)
 * - contentWrapper (wrapper for blocks without section headings)
 *
 * Does NOT include:
 * - Individual content blocks (must be wrapped in PageSection or ContentWrapper)
 * - Layout blocks (must be wrapped in PageSection or ContentWrapper)
 */
export const PAGE_ROOT_BLOCK_LIST = [
  defineArrayMember({ type: 'pageSection' }),
  defineArrayMember({ type: 'contentWrapper' }),
];

/**
 * PAGE_CONTENT_BLOCK_LIST - For main page content areas (DEPRECATED)
 *
 * @deprecated Use PAGE_ROOT_BLOCK_LIST instead. This will be removed in a future version.
 *
 * This includes the standard block list PLUS top-level PageSections.
 * Use this for the main content field of pages.
 *
 * Includes:
 * - All standard blocks (via STANDARD_BLOCK_LIST)
 * - pageSection (top-level sections only)
 */
export const PAGE_CONTENT_BLOCK_LIST = [
  defineArrayMember({ type: 'pageSection' }),
  ...STANDARD_BLOCK_LIST,
];

/**
 * Helper function to create section content block lists with nesting rules
 *
 * This enforces the section nesting hierarchy:
 * - PageSection can contain SubSections
 * - SubSection can contain SubSubSections
 * - SubSubSection cannot contain any sections
 *
 * @param allowedChildSections - Array of child section type names (e.g., ['subSection'])
 * @returns Combined array of child sections + standard blocks
 */
export function createSectionBlockList(allowedChildSections?: string[]) {
  const childSections = allowedChildSections?.map((childType) =>
    defineArrayMember({ type: childType })
  ) || [];

  return [
    ...childSections,
    ...STANDARD_BLOCK_LIST,
  ];
}
