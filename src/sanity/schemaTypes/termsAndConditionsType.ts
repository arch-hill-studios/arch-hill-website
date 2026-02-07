// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { PAGE_CONTENT_BLOCK_LIST } from './shared/blockLists';

export const termsAndConditionsType = defineType({
  name: 'termsAndConditions',
  title: 'Terms & Conditions',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'hide',
      title: 'Hide Page',
      type: 'boolean',
      description:
        'Hide this page from the frontend. When hidden, the link will automatically be removed from the Footer and visiting the URL manually will show a not found error.',
      initialValue: false,
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      description: 'The main title (H1) of the Terms & Conditions page',
      validation: (Rule) => Rule.required().error('Page title is required'),
      initialValue: 'Terms & Conditions',
    }),
    defineField({
      name: 'topText',
      title: 'Top Text',
      type: 'string',
      description: 'Optional text displayed at the top of the page. Can be used for last updated dates, notices, or any contextual information.',
    }),
    defineField({
      name: 'content',
      title: 'Terms & Conditions Content',
      type: 'array',
      description: 'Build your Terms & Conditions content using page sections and content blocks',
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
    }),
  ],
  preview: {
    select: {
      title: 'title',
      hide: 'hide',
    },
    prepare({ title, hide }) {
      const titlePrefix = hide ? '🚫 ' : '';
      const statusSuffix = hide ? ' (Hidden)' : '';

      return {
        title: `${titlePrefix}${title || 'Terms & Conditions'}${statusSuffix}`,
        subtitle: 'Legal Document',
      };
    },
  },
});
