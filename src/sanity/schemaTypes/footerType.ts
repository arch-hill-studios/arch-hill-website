// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { ComponentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { createLinkFieldSet } from './shared/linkSystem';

export const footerType = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'footerMessages',
      type: 'array',
      title: 'Footer Messages',
      description: 'Add messages that will appear below the logo in the footer',
      of: [
        {
          type: 'object',
          title: 'Footer Message',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Message Title',
              description: 'Optional title for the message (e.g., "To All Artists:")',
              validation: (Rule) => Rule.max(100).warning('Keep titles concise for better display'),
            }),
            defineField({
              name: 'message',
              type: 'string',
              title: 'Message Text',
              description: 'The main message content',
              validation: (Rule) =>
                Rule.max(200).warning('Keep messages concise for better display'),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              message: 'message',
            },
            prepare({ title, message }) {
              const displayTitle = title || 'Untitled Message';
              const displaySubtitle = message
                ? message.substring(0, 50) + (message.length > 50 ? '...' : '')
                : 'No message';
              return {
                title: displayTitle,
                subtitle: displaySubtitle,
              };
            },
          },
        },
      ],
      options: {
        sortable: true,
      },
    }),
    defineField({
      name: 'quickLinks',
      type: 'array',
      title: 'Quick Links',
      description:
        'Add quick navigation links to appear in the footer. This field is optional - leave empty if not needed',
      of: [
        {
          type: 'object',
          title: 'Quick Link',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Link Label',
              description: 'The text to display for this link',
              validation: (Rule) =>
                Rule.required()
                  .error('Link label is required')
                  .max(50)
                  .warning('Keep link labels concise for better display'),
            }),
            ...createLinkFieldSet({
              linkTypeConfig: {
                description:
                  'Choose whether this links to another page on your site or an external URL',
                initialValue: 'internal',
              },
              internalLinkConfig: {
                description: 'Select a page from your website to link to',
              },
              externalUrlConfig: {
                description: 'Enter the full URL for the external link',
              },
            }),
          ],
          preview: {
            select: {
              label: 'label',
              linkType: 'linkType',
              internalLink: 'internalLink.title',
              externalUrl: 'externalUrl',
            },
            prepare({ label, linkType, internalLink, externalUrl }) {
              const displayTitle = label || 'Untitled Link';
              let displaySubtitle = '';

              if (linkType === 'internal') {
                displaySubtitle = internalLink
                  ? `Internal: ${internalLink}`
                  : 'Internal: (No page selected)';
              } else if (linkType === 'external') {
                displaySubtitle = externalUrl
                  ? `External: ${externalUrl}`
                  : 'External: (No URL entered)';
              }

              return {
                title: displayTitle,
                subtitle: displaySubtitle,
              };
            },
          },
        },
      ],
      options: {
        sortable: true,
      },
    }),
    defineField({
      name: 'copyrightText',
      type: 'string',
      title: 'Copyright Text',
      description: 'Copyright notice that appears at the bottom of the footer',
      initialValue: '© Your Organization Name 2025',
      validation: (Rule) => Rule.required().error('Copyright text is required'),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
        subtitle: 'Site footer content and messages',
      };
    },
  },
});
