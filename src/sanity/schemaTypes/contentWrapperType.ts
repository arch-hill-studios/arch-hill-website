// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { BlockElementIcon } from '@sanity/icons';
import { STANDARD_BLOCK_LIST } from './shared/blockLists';
import { createBackgroundFields } from './shared/backgroundStyles';

export const contentWrapperType = defineType({
  name: 'contentWrapper',
  title: 'Content Wrapper',
  type: 'object',
  icon: BlockElementIcon,
  description:
    'A container for grouping content blocks with optional background styling. Use this when you want to group blocks together without adding a section heading.',
  fields: [
    ...createBackgroundFields('content area'),
    defineField({
      name: 'useCompactGap',
      title: 'Use Compact Gap After Wrapper',
      type: 'boolean',
      description:
        'Add a smaller gap after this wrapper instead of the default spacing. Note: Gap size may be overridden by other layout rules depending on content placement. Large gaps work best for long sections with varied content, while compact gaps suit shorter text-focused sections.',
      initialValue: false,
    }),
    defineField({
      name: 'content',
      title: 'Content Blocks',
      type: 'array',
      description:
        'Add content blocks to this wrapper. Section blocks (Page Section, Sub Section) cannot be added here.',
      of: STANDARD_BLOCK_LIST,
      validation: (Rule) =>
        Rule.min(1).error('Content Wrapper must contain at least one content block'),
    }),
  ],
  preview: {
    select: {
      content: 'content',
      backgroundStyle: 'backgroundStyle',
    },
    prepare(selection: { content?: unknown[]; backgroundStyle?: string }) {
      const { content, backgroundStyle } = selection;
      const blockCount = Array.isArray(content) ? content.length : 0;
      const bgText = backgroundStyle ? ` • ${backgroundStyle}` : '';

      return {
        title: 'Content Wrapper',
        subtitle: `${blockCount} block${blockCount !== 1 ? 's' : ''}${bgText}`,
      };
    },
  },
});
