// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';
import { createLinkFieldSet } from './shared/linkSystem';

export const contactGeneralContentType = defineType({
  name: 'contactGeneralContent',
  title: 'Contact General Content',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {
      name: 'header',
      title: 'Page Header',
    },
    {
      name: 'contactInfo',
      title: 'Contact Info',
    },
    {
      name: 'closingCard',
      title: 'Closing Card',
    },
  ],
  fields: [
    // Page Header Group
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      description: 'The main title (H1) of the contact page',
      validation: (Rule) => Rule.required().error('Page title is required'),
      group: 'header',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      title: 'Page Subtitle',
      description:
        'Optional subtitle that appears below the page title. This text will also be used for SEO meta tags (the description that appears in search engine results and when sharing on social media).',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      group: 'header',
    }),
    defineField({
      name: 'introduction',
      type: 'text',
      title: 'Introduction',
      description:
        'Introductory text that appears at the top of the contact page, above the contact methods',
      rows: 4,
      validation: (Rule) => Rule.max(500),
      group: 'header',
    }),

    // Contact Info Group
    defineField({
      name: 'emailTitle',
      type: 'string',
      title: 'Email Section Title',
      description: 'Title for the email contact card (e.g., "Email me")',
      initialValue: 'Email me',
      validation: (Rule) => Rule.max(50),
      group: 'contactInfo',
    }),
    defineField({
      name: 'phoneTitle',
      type: 'string',
      title: 'Phone Section Title',
      description: 'Title for the phone contact card (e.g., "Call me")',
      initialValue: 'Call me',
      validation: (Rule) => Rule.max(50),
      group: 'contactInfo',
    }),

    // Closing Card Group
    defineField({
      name: 'closingCardTitle',
      type: 'string',
      title: 'Card Title',
      description: 'The main heading of the closing call-to-action card',
      validation: (Rule) => Rule.max(100),
      group: 'closingCard',
    }),
    defineField({
      name: 'closingCardBody',
      type: 'text',
      title: 'Card Body Text',
      description: 'The main content text of the closing card',
      rows: 3,
      validation: (Rule) => Rule.max(500),
      group: 'closingCard',
    }),
    defineField({
      name: 'closingCardCtaText',
      type: 'string',
      title: 'CTA Button Text',
      description: 'Text displayed on the call-to-action button',
      validation: (Rule) => Rule.max(50),
      group: 'closingCard',
    }),
    ...createLinkFieldSet({ group: 'closingCard' }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact - General Content',
        subtitle: 'Page header, contact info, and closing card',
      };
    },
  },
});
