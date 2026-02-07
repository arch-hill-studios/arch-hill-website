// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { MenuIcon } from '@sanity/icons';
import { defineField, defineType, defineArrayMember } from 'sanity';
import { createCTAListField } from './shared/ctaListType';

export const headerType = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  icon: MenuIcon,
  groups: [
    {
      name: 'horizontal',
      title: 'Horizontal nav',
    },
    {
      name: 'vertical',
      title: 'Vertical nav',
    },
    {
      name: 'general',
      title: 'General',
    },
  ],
  fields: [
    defineField({
      name: 'horizontalNav',
      title: 'Horizontal Navigation',
      type: 'array',
      description: 'Links displayed in the horizontal navigation bar',
      group: 'horizontal',
      of: [
        defineArrayMember({
          type: 'navLink',
        }),
      ],
      options: {
        sortable: true,
      },
    }),
    createCTAListField({
      name: 'horizontalNavCtas',
      title: 'Horizontal Navigation CTAs',
      description: 'Call-to-action buttons displayed on the far right of the horizontal navigation bar. Leave empty if no CTAs are needed.',
      group: 'horizontal',
    }),
    defineField({
      name: 'showVerticalNavOnDesktop',
      title: 'Show Vertical Nav on Desktop',
      type: 'boolean',
      description: 'Controls whether the hamburger menu icon is visible on desktop screens. If disabled, the hamburger icon will only appear on mobile devices.',
      group: 'vertical',
      initialValue: true,
    }),
    defineField({
      name: 'verticalNav',
      title: 'Vertical Navigation',
      type: 'array',
      description:
        'Navigation sections displayed in the vertical navigation menu (when selecting the hamburger icon). Each section can contain multiple links and have an optional heading.',
      group: 'vertical',
      of: [
        defineArrayMember({
          type: 'navSection',
        }),
      ],
      options: {
        sortable: true,
      },
      validation: (Rule) => Rule.min(1).error('At least one navigation section is required'),
    }),
    createCTAListField({
      name: 'verticalNavCtas',
      title: 'Vertical Navigation CTAs',
      description: 'Call-to-action buttons displayed at the bottom of the vertical navigation menu. Leave empty if no CTAs are needed.',
      group: 'vertical',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Header',
        subtitle: 'Site header settings',
      };
    },
  },
});
