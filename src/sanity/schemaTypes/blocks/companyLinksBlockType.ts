// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { LinkIcon } from '@sanity/icons';

export const companyLinksBlockType = defineType({
  name: 'companyLinksBlock',
  title: 'Company Links Block',
  type: 'object',
  icon: LinkIcon,
  description: 'Displays company social media and website links in a grid layout',
  options: {
    columns: 1,
    collapsible: false,
  },
  fields: [
    defineField({
      name: 'blockAdded',
      title: 'Company Links Block Added!',
      type: 'string',
      initialValue: 'This block will display all company links configured in Site Settings. You can close this dialog.',
      readOnly: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Company Links Block',
        subtitle: 'Displays company social media and website links',
        media: LinkIcon,
      };
    },
  },
});