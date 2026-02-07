// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { CheckmarkCircleIcon } from '@sanity/icons';

export const contactFormSettingsType = defineType({
  name: 'contactFormSettings',
  title: 'Contact Form',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'formTitle',
      type: 'string',
      title: 'Form Title',
      description: 'Title displayed above the contact form (e.g., "Send me a message")',
      initialValue: 'Send me a message',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'formSubtitle',
      type: 'string',
      title: 'Form Subtitle',
      description:
        'Subtitle displayed below the form title (e.g., "Submit your enquiry using my contact form.")',
      initialValue: 'Submit your enquiry using my contact form.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'successHeading',
      type: 'string',
      title: 'Success Message Heading',
      description: 'Heading displayed after form submission is successful',
      initialValue: 'Thank you for your message!',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'successMessage',
      type: 'text',
      title: 'Success Message Text',
      description: 'Message displayed after form submission is successful',
      rows: 3,
      initialValue:
        'I have received your message and will get back to you as soon as possible. You should also receive a confirmation email shortly.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact - Form Settings',
        subtitle: 'Success message configuration',
      };
    },
  },
});
