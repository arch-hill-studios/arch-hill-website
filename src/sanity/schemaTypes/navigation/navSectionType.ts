// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField, defineArrayMember } from 'sanity';
import { FolderIcon } from '@sanity/icons';

export const navSectionType = defineType({
  name: 'navSection',
  title: 'Navigation Section',
  type: 'object',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'hideSection',
      title: 'Hide Section',
      type: 'boolean',
      description:
        'Hide this entire navigation section from being displayed. This will hide all links within this section regardless of their individual settings.',
      initialValue: false,
    }),
    defineField({
      name: 'hideOnDesktop',
      title: 'Hide on Desktop',
      type: 'boolean',
      description: 'Hide this entire navigation section on desktop. Section remains visible on mobile.',
      initialValue: false,
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Optional heading text for this navigation section. Leave empty for no heading.',
      validation: (Rule) => Rule.max(50).warning('Keep heading text concise for better display'),
    }),
    defineField({
      name: 'links',
      title: 'Navigation Links',
      type: 'array',
      description: 'Links to display in this navigation section',
      of: [
        defineArrayMember({
          type: 'verticalNavLink',
        }),
      ],
      options: {
        sortable: true,
      },
      validation: (Rule) => Rule.min(1).error('Each section must have at least one navigation link'),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      hideSection: 'hideSection',
      hideOnDesktop: 'hideOnDesktop',
      links: 'links',
    },
    prepare(selection) {
      const { heading, hideSection, hideOnDesktop, links } = selection;

      const linkCount = links?.length || 0;
      const titlePrefix = hideSection ? '🚫 ' : '';
      const desktopPrefix = hideOnDesktop ? '🖥️ ' : '';
      const statusSuffix = hideSection ? ' (Hidden)' : hideOnDesktop ? ' (Hidden on Desktop)' : '';

      const displayTitle = heading
        ? `${titlePrefix}${desktopPrefix}${heading}${statusSuffix}`
        : `${titlePrefix}${desktopPrefix}Navigation Section${statusSuffix}`;

      return {
        title: displayTitle,
        subtitle: `${linkCount} link${linkCount !== 1 ? 's' : ''}`,
      };
    },
  },
});