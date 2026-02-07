// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { MenuIcon } from '@sanity/icons';

export const blockListWithStatsType = defineType({
  name: 'blockListWithStats',
  title: 'Block List with Stats',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'blockListItem',
          title: 'Block List Item',
          fields: [
            defineField({
              name: 'leftContent',
              title: 'Left Hand Side Content (Primary)',
              type: 'string',
              description: 'Main content that will appear on the left side of the row (bold text)',
              validation: (Rule) => Rule.required().min(1).max(200),
            }),
            defineField({
              name: 'rightContent',
              title: 'Right Hand Side Content (Secondary)',
              type: 'string',
              description: 'Optional secondary content that will appear on the right side of the row',
              validation: (Rule) => Rule.max(200),
            }),
          ],
          preview: {
            select: {
              leftContent: 'leftContent',
              rightContent: 'rightContent',
            },
            prepare({ leftContent, rightContent }) {
              const title = leftContent || 'Untitled Item';
              const subtitle = rightContent || 'No right content';
              return {
                title,
                subtitle,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(50),
      description: 'Add items to your block list. Items can be reordered by dragging.',
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const itemCount = items?.length || 0;
      return {
        title: `Block List with Stats (${itemCount} items)`,
        subtitle: itemCount === 1 ? '1 item' : `${itemCount} items`,
        media: MenuIcon,
      };
    },
  },
});