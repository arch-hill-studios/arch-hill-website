// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { PAGE_CONTENT_BLOCK_LIST } from './shared/blockLists';
import { createLinkFieldSet } from './shared/linkSystem';

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'header',
      title: 'Page Header',
    },
    {
      name: 'content',
      title: 'Page Content',
    },
    {
      name: 'closingCta',
      title: 'Closing CTA',
    },
    {
      name: 'settings',
      title: 'Page Settings',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      description: 'The main title (H1) of the page',
      validation: (Rule) => Rule.required().error('Page title is required'),
      group: 'header',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL Slug',
      description: 'The URL path for this page',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required().error('URL slug is required'),
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
      name: 'content',
      title: 'Page Content',
      type: 'array',
      description: 'Build your page content using page sections and content blocks',
      of: PAGE_CONTENT_BLOCK_LIST,
      options: {
        insertMenu: {
          views: [
            {
              name: 'list',
            },
          ],
        },
        // Improve the modal experience
        modal: { type: 'dialog' },
      },
      group: 'content',
    }),
    defineField({
      name: 'hasClosingCta',
      title: 'Add Closing CTA',
      type: 'boolean',
      description: 'Enable a call-to-action section at the bottom of the page',
      initialValue: false,
      group: 'closingCta',
    }),
    defineField({
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'object',
      group: 'closingCta',
      hidden: ({ parent }) => !parent?.hasClosingCta,
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'The heading for the closing CTA section',
          validation: (Rule) => Rule.required().max(100),
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          description: 'The message text displayed below the title',
          rows: 3,
          validation: (Rule) => Rule.required().max(500),
        }),
        defineField({
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string',
          description: 'Text displayed on the call-to-action button',
          validation: (Rule) => Rule.required().max(50),
        }),
        ...createLinkFieldSet(),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      subtitle: 'subtitle',
      media: 'heroImage',
    },
    prepare({ title, slug, subtitle, media }) {
      return {
        title: title || 'Untitled Page',
        subtitle: subtitle || slug || '',
        media,
      };
    },
  },
});
