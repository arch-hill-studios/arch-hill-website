// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const contactConfirmationEmailType = defineType({
  name: 'contactConfirmationEmail',
  title: 'Confirmation Email',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'emailGreeting',
      type: 'string',
      title: 'Email Greeting',
      description: 'Greeting text at the start of the confirmation email (e.g., "Hi" or "Hello")',
      initialValue: 'Hi',
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: 'emailIntroMessage',
      type: 'text',
      title: 'Email Introduction Message',
      description: 'Introduction message in the confirmation email',
      rows: 3,
      initialValue:
        'We have successfully received your message and will aim to get back to you as soon as possible.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emailOutroMessage',
      type: 'text',
      title: 'Email Closing Message',
      description: 'Closing message in the confirmation email',
      rows: 3,
      initialValue: 'If you have any urgent questions, feel free to reach out to me directly.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact - Confirmation Email',
        subtitle: 'Email content sent to users after contact form submission',
      };
    },
  },
});
