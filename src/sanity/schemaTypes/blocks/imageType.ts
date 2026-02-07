import { defineField, defineType } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export const imageType = defineType({
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
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
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Small (50% on desktop)', value: 'small' },
        ],
      },
      initialValue: 'full',
      description: 'On mobile, all images will be full width regardless of this setting',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      description: 'Optional caption that appears below the image',
    }),
  ],
  preview: {
    select: {
      image: 'image',
      size: 'size',
      caption: 'caption',
      alt: 'image.alt',
    },
    prepare({ image, size, caption, alt }) {
      const title = alt || 'Image';
      const subtitle = [
        size === 'small' ? 'Small' : 'Full Width',
        caption ? `Caption: ${caption.slice(0, 30)}${caption.length > 30 ? '...' : ''}` : '',
      ]
        .filter(Boolean)
        .join(' • ');

      return {
        title,
        subtitle,
        media: image,
      };
    },
  },
});