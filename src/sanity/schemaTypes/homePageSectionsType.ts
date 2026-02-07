// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { BlockContentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const homePageSectionsType = defineType({
  name: 'homePageSections',
  title: 'Home Page Custom Sections',
  type: 'document',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'content',
      type: 'pageBuilder',
      title: 'Sections',
      description:
        'Build your page by adding sections. Each section can contain different types of content blocks.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Custom Sections',
        subtitle: 'Home page content sections',
      };
    },
  },
});
