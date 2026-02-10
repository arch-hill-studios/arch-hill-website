// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineArrayMember, defineField, defineType } from 'sanity';
import { DocumentsIcon } from '@sanity/icons';

export const serviceListType = defineType({
  name: 'serviceList',
  title: 'Service List',
  type: 'object',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      description: 'Add and reorder the services displayed in this list.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'service',
          title: 'Service',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().min(1).max(200),
              description: 'The name of this service.',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'blockContent',
              description: 'Rich text description of this service.',
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              validation: (Rule) => Rule.max(100),
              description: 'e.g. "$70 for 3hr session" or "Get in contact to discuss rates"',
            }),
            defineField({
              name: 'disclaimer',
              title: 'Disclaimer',
              type: 'string',
              validation: (Rule) => Rule.max(300),
              description: 'Optional fine print below the price, e.g. cancellation policy.',
            }),
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              description:
                'Upload one or more images. Multiple images will display as an auto-rotating slideshow.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'serviceImage',
                  title: 'Service Image',
                  fields: [
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: { hotspot: true },
                      validation: (Rule) => Rule.required(),
                      fields: [
                        {
                          name: 'alt',
                          type: 'string',
                          title: 'Alternative Text',
                          description:
                            'Describes the image for SEO and screen readers.',
                        },
                      ],
                    }),
                  ],
                  preview: {
                    select: {
                      image: 'image',
                      alt: 'image.alt',
                    },
                    prepare({ image, alt }) {
                      return {
                        title: alt || 'Service Image',
                        media: image,
                      };
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.max(10),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              price: 'price',
              media: 'images.0.image',
            },
            prepare({ title, price, media }) {
              return {
                title: title || 'Untitled Service',
                subtitle: price || '',
                media,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
  ],
  preview: {
    select: {
      services: 'services',
    },
    prepare({ services }) {
      const count = services?.length || 0;
      return {
        title: 'Service List',
        subtitle: `${count} service${count !== 1 ? 's' : ''}`,
      };
    },
  },
});
