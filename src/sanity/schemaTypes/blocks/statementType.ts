// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';

export const statementType = defineType({
  name: 'statement',
  title: 'Statement',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Statement Text',
      type: 'text',
      description: 'The main statement text',
      rows: 3,
      validation: (Rule) => Rule.required().error('Statement text is required'),
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      const previewText = text || 'Statement';
      const truncatedText =
        previewText.length > 60 ? `${previewText.substring(0, 60)}...` : previewText;

      return {
        title: truncatedText,
        subtitle: 'Statement Block',
        media: DocumentTextIcon,
      };
    },
  },
});
