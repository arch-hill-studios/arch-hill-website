// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { HomeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Home Page - Lightweight page document for the home page
 *
 * This document serves as the "page" entity for the home page, making it consistent
 * with other page types (faqPage, contactPage, etc.) in the linking system.
 *
 * The actual content of the home page is stored in separate section documents:
 * - homePageHero: The hero section content
 * - homePageSections: Additional page builder sections
 *
 * This separation allows:
 * 1. Consistent internal linking (users link to "Home Page", not "Home Page Hero")
 * 2. Organized Sanity Studio structure with separate section editors
 * 3. Future extensibility for page-level settings (SEO overrides, etc.)
 */
export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    // Title field for display in Sanity Studio and reference dropdowns
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Internal title for this page (used in Sanity Studio and link dropdowns)',
      initialValue: 'Home Page',
      readOnly: true,
      hidden: true,
    }),
    // Additional page-level settings can be added here in the future
    // For example: SEO overrides, page-specific metadata, etc.
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page',
        subtitle: 'Main landing page',
      };
    },
  },
});
