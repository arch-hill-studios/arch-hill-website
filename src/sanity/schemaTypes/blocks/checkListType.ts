// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { CheckmarkCircleIcon } from '@sanity/icons';

export const checkListType = defineType({
  name: 'checkList',
  title: 'Check List',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'checkListItem',
          title: 'Check List Item',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              description: 'The text content for this checklist item',
              validation: (Rule) => Rule.required().min(1).max(200),
            }),
          ],
          preview: {
            select: {
              text: 'text',
            },
            prepare({ text }) {
              const title = text || 'Untitled Item';
              return {
                title: `✓ ${title}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(50),
      description: 'Add items to your checklist. Items can be reordered by dragging.',
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const itemCount = items?.length || 0;
      return {
        title: `Check List (${itemCount} items)`,
        subtitle: itemCount === 1 ? '1 item' : `${itemCount} items`,
        media: CheckmarkCircleIcon,
      };
    },
  },
});
