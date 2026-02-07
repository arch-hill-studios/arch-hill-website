// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { MenuIcon } from '@sanity/icons';
import { createIconField } from '../shared/iconFieldConfig';

export const detailedListType = defineType({
  name: 'detailedList',
  title: 'Detailed List',
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
          name: 'detailedListItem',
          title: 'Detailed List Item',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().min(1).max(200),
              description: 'Title for this item (will be displayed with gradient color)',
            }),
            createIconField({
              required: false,
              description: 'Optional icon - select from library',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required().min(1).max(1000),
              description: 'Detailed description for this item',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
              description: 'description',
            },
            prepare({ title, icon, description }) {
              const displayTitle = title || 'Untitled Item';
              const iconInfo = icon ? `Icon: ${icon}` : 'No icon';
              const subtitle = `${iconInfo} - ${description?.substring(0, 50) || 'No description'}...`;

              return {
                title: displayTitle,
                subtitle,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(20),
      description: 'Add items to your detailed list. Items can be reordered by dragging.',
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const itemCount = items?.length || 0;
      return {
        title: `Detailed List (${itemCount} items)`,
        subtitle: itemCount === 1 ? '1 item' : `${itemCount} items`,
        media: MenuIcon,
      };
    },
  },
});
