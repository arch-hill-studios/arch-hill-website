// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { EyeOpenIcon } from '@sanity/icons';
import { CONTENT_ONLY_BLOCKS } from '../shared/blockLists';

export const responsiveWrapperType = defineType({
  name: 'responsiveWrapper',
  title: 'Responsive Wrapper',
  type: 'object',
  icon: EyeOpenIcon,
  fields: [
    defineField({
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Mobile Only', value: 'mobileOnly' },
          { title: 'Desktop Only', value: 'desktopOnly' },
        ],
        layout: 'radio',
      },
      initialValue: 'mobileOnly',
      description:
        'Choose when to display this content:\n\n• Mobile Only: Visible on mobile devices, hidden on desktop (md: and larger)\n\n• Desktop Only: Visible on desktop, hidden on mobile devices',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description:
        'Add content blocks that will only display based on the selected display mode. You can include text, images, buttons, quotes, and more.',
      of: CONTENT_ONLY_BLOCKS,
      validation: (Rule) => Rule.min(1).error('Responsive wrapper must have at least one content block'),
    }),
  ],
  preview: {
    select: {
      displayMode: 'displayMode',
      content: 'content',
    },
    prepare({ displayMode, content }) {
      const modeLabel = displayMode === 'mobileOnly' ? 'Mobile Only' : 'Desktop Only';
      const blockCount = Array.isArray(content) ? content.length : 0;
      const icon = displayMode === 'mobileOnly' ? '📱' : '🖥️';

      return {
        title: `${icon} Responsive Wrapper: ${modeLabel}`,
        subtitle: `${blockCount} content block${blockCount !== 1 ? 's' : ''}`,
        media: EyeOpenIcon,
      };
    },
  },
});
