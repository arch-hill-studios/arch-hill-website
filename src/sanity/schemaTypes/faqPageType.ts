// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { PAGE_CONTENT_BLOCK_LIST } from './shared/blockLists';

export const faqPageType = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {
      name: 'header',
      title: 'Page Header',
    },
    {
      name: 'content',
      title: 'Page Content',
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
  ],
  preview: {
    prepare() {
      return {
        title: 'FAQ Page',
        subtitle: 'Frequently Asked Questions',
      };
    },
  },
});
