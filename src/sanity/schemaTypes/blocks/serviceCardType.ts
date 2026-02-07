// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';

export const serviceCardType = defineType({
  name: 'serviceCard',
  title: 'Service Card',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image (Optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Helps explain what the image is for SEO and screen readers. Highly recommended to provide something that describes the image; if not provided, the system will try to come up with something.',
        },
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sub Title (Optional)',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(1).max(500),
      description: 'Plain text with line breaks. Press Enter for line breaks.',
    }),
    defineField({
      name: 'list',
      title: 'List (Optional)',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'List Title',
          type: 'string',
          validation: (Rule) => Rule.required().min(1).max(100),
        }),
        defineField({
          name: 'items',
          title: 'List Items',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'listItem',
              title: 'List Item',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Item Text',
                  type: 'string',
                  validation: (Rule) => Rule.required().min(1).max(200),
                }),
              ],
              preview: {
                select: {
                  title: 'text',
                },
              },
            },
          ],
          validation: (Rule) => Rule.required().min(1).max(20),
        }),
      ],
    }),
    defineField({
      name: 'pricingInfo',
      title: 'Pricing Info (Optional)',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Service Card',
        subtitle: subtitle || '',
        media: media,
      };
    },
  },
});
