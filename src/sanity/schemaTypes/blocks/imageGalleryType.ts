import { defineField, defineType, defineArrayMember } from 'sanity';
import { ImagesIcon } from '@sanity/icons';

export const imageGalleryType = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      options: {
        list: [
          { title: '2 Columns', value: '2' },
          { title: '3 Columns', value: '3' },
          { title: '4 Columns', value: '4' },
        ],
      },
      initialValue: '3',
      description: 'Number of columns for the gallery grid',
    }),
    defineField({
      name: 'showCaptionsBelowImages',
      title: 'Show captions below images',
      type: 'boolean',
      initialValue: false,
      description:
        'When enabled, image captions will be displayed below each image in the gallery. Captions will always appear in the modal viewer regardless of this setting.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description:
        'Images of aspect ratio close to 4:3 (landscape) work best for the image thumnails.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
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
                  description:
                    'Helps explain what the image is for SEO and screen readers. Highly recommended to provide something that describes the image; if not provided, the system will try to come up with something.',
                },
              ],
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'text',
              description: 'Optional caption for this image',
            }),
          ],
          preview: {
            select: {
              image: 'image',
              caption: 'caption',
              alt: 'image.alt',
            },
            prepare({ image, caption, alt }) {
              const title = alt || 'Gallery Image';
              const subtitle = caption
                ? `Caption: ${caption.slice(0, 40)}${caption.length > 40 ? '...' : ''}`
                : 'No caption';

              return {
                title,
                subtitle,
                media: image,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      images: 'images',
      columns: 'columns',
    },
    prepare({ images, columns }) {
      const imageCount = images?.length || 0;
      const columnText =
        columns === '2' ? '2 columns' : columns === '3' ? '3 columns' : '4 columns';

      const title = `Image Gallery (${imageCount} image${imageCount !== 1 ? 's' : ''})`;
      const subtitle = `${columnText}`;

      // Use the first image as the preview
      const firstImage = images?.[0]?.image;

      return {
        title,
        subtitle,
        media: firstImage || ImagesIcon,
      };
    },
  },
});
