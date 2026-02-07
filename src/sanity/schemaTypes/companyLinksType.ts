// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { LinkIcon } from '@sanity/icons';

export const companyLinksType = defineType({
  name: 'companyLinks',
  title: 'Company & Social Links',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'companyLinks',
      type: 'companyLinksArray',
      title: 'Company Social Links',
      description:
        "Manage your company's social media links with drag-and-drop ordering. These can be displayed throughout your site.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Company & Social Links',
        subtitle: 'Social media and external links',
      };
    },
  },
});
