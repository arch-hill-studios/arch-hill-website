// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const contactSectionType = defineType({
  name: 'contactSection',
  title: 'Contact Section',
  type: 'object',
  icon: EnvelopeIcon,
  options: {
    columns: 1,
    collapsible: false,
  },
  fields: [
    defineField({
      name: 'addedInfo',
      title: 'Contact Section Added!',
      type: 'string',
      initialValue: 'The contact section has been added to this page.',
      readOnly: true,
    }),
    defineField({
      name: 'editInfo',
      title: 'Editing Contact Details',
      type: 'string',
      initialValue:
        'To edit contact details and form settings, go to the Contact section and Business & Contact Info in Site Management.',
      readOnly: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Section',
        subtitle: 'Contact form and details',
        media: EnvelopeIcon,
      };
    },
  },
});
