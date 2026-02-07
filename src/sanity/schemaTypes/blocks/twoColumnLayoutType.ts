// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { ComponentIcon } from '@sanity/icons';
import { LAYOUT_CHILD_BLOCKS } from '../shared/blockLists';

export const twoColumnLayoutType = defineType({
  name: 'twoColumnLayout',
  title: '2 Column Layout',
  type: 'object',
  icon: ComponentIcon,
  description: 'Create a two-column layout with independently managed content in each column. On desktop, content displays side-by-side; on mobile, left column content appears before right column content in a vertical stack.',
  fields: [
    defineField({
      name: 'columnSplit',
      title: 'Column Split Proportion',
      type: 'string',
      description: 'Choose the width proportion between left and right columns. For example, "60/40" means the left column takes 60% and the right column takes 40% of the available width.',
      options: {
        list: [
          { title: '50/50 (Equal)', value: '50/50' },
          { title: '60/40 (Left Wider)', value: '60/40' },
          { title: '40/60 (Right Wider)', value: '40/60' },
          { title: '70/30 (Left Much Wider)', value: '70/30' },
          { title: '30/70 (Right Much Wider)', value: '30/70' },
        ],
        layout: 'radio',
      },
      initialValue: '50/50',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'verticallyCenter',
      title: 'Vertically Center Content',
      type: 'boolean',
      description: 'When enabled, the column with less content will be vertically centered to align with the other column. This creates a more balanced visual appearance when columns have different heights.',
      initialValue: false,
    }),
    defineField({
      name: 'leftColumn',
      title: 'Left Column',
      type: 'array',
      description: 'Content for the left column (appears first on mobile). Can contain cards and content blocks, but not nested two-column or grid layouts.',
      of: LAYOUT_CHILD_BLOCKS,
      validation: (Rule) =>
        Rule.required().min(1).error('Left column must contain at least one item'),
    }),
    defineField({
      name: 'rightColumn',
      title: 'Right Column',
      type: 'array',
      description: 'Content for the right column (appears after left column on mobile). Can contain cards and content blocks, but not nested two-column or grid layouts.',
      of: LAYOUT_CHILD_BLOCKS,
      validation: (Rule) =>
        Rule.required().min(1).error('Right column must contain at least one item'),
    }),
  ],
  preview: {
    select: {
      leftColumn: 'leftColumn',
      rightColumn: 'rightColumn',
      verticallyCenter: 'verticallyCenter',
      columnSplit: 'columnSplit',
    },
    prepare({ leftColumn, rightColumn, verticallyCenter, columnSplit }) {
      const leftCount = leftColumn?.length || 0;
      const rightCount = rightColumn?.length || 0;
      const centerText = verticallyCenter ? ' • Centered' : '';
      const splitText = columnSplit ? ` • ${columnSplit}` : '';
      const title = '2 Column Layout';
      const subtitle = `Left: ${leftCount} item${leftCount !== 1 ? 's' : ''} • Right: ${rightCount} item${rightCount !== 1 ? 's' : ''}${splitText}${centerText}`;

      return {
        title,
        subtitle,
        media: ComponentIcon,
      };
    },
  },
});
