// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { ComponentIcon } from '@sanity/icons';
import { LAYOUT_CHILD_BLOCKS } from '../shared/blockLists';

export const gridLayoutType = defineType({
  name: 'gridLayout',
  title: 'Grid Layout',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Number of Columns',
      type: 'string',
      options: {
        list: [
          { title: '2 Columns', value: '2' },
          { title: '3 Columns', value: '3' },
          { title: '4 Columns', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '2',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Grid Content',
      type: 'array',
      description: 'Grid content items. Can contain cards and content blocks, but not nested grids or two-column layouts.',
      of: LAYOUT_CHILD_BLOCKS,
      validation: (Rule) =>
        Rule.required().min(1).error('Grid layout must contain at least one item'),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      content: 'content',
    },
    prepare({ columns, content }) {
      const itemCount = content?.length || 0;
      const title = `Grid Layout (${columns} columns)`;
      const subtitle = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;

      return {
        title,
        subtitle,
        media: ComponentIcon,
      };
    },
  },
});
