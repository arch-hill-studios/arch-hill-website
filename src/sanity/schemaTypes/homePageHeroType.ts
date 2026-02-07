// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { SparklesIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { createCTAListField } from './shared/ctaListType';

export const homePageHeroType = defineType({
  name: 'homePageHero',
  title: 'Home Page Hero',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'heroStyle',
      type: 'string',
      title: 'Hero Style',
      description: 'Choose the hero section style',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Background Images', value: 'background-images' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'heroImages',
      type: 'array',
      title: 'Images',
      description:
        'Add one or more images that will cycle in the hero section. Images can be reordered by dragging.',
      options: {
        sortable: true,
      },
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description:
                'Helps explain what the image is for SEO and screen readers. Highly recommended to provide something that describes the image; if not provided, the system will try to come up with something.',
            }),
          ],
        },
      ],
      hidden: ({ document }) => document?.heroStyle === 'video',
      validation: (Rule) =>
        Rule.custom((images, context) => {
          const document = context.document;
          if (document?.heroStyle === 'background-images' && (!images || images.length === 0)) {
            return 'Please add at least one image when Background Images hero style is selected';
          }
          if (document?.heroStyle === 'default' && (!images || images.length === 0)) {
            return 'Please add at least one image when Default hero style is selected';
          }
          return true;
        }),
    }),
    defineField({
      name: 'heroVideo',
      type: 'file',
      title: 'Video',
      description:
        '⚠️ IMPORTANT: Upload as MP4 (H.264 codec) for best browser compatibility. MOV files may not play in Chrome/Firefox. Avoid large file sizes - compress your video before uploading. The video will loop continuously and be muted.',
      options: {
        accept: 'video/mp4,video/webm',
      },
      hidden: ({ document }) => document?.heroStyle !== 'video',
      validation: (Rule) =>
        Rule.custom((video, context) => {
          const document = context.document;
          if (document?.heroStyle === 'video' && !video) {
            return 'Please upload a video when Video hero style is selected';
          }
          return true;
        }),
    }),
    defineField({
      name: 'heroImageTransitionDuration',
      type: 'number',
      title: 'Image Transition Duration (seconds)',
      description:
        'How long each image displays before transitioning to the next (only applies when multiple images are added). Minimum: 2 seconds, Maximum: 30 seconds.',
      initialValue: 4,
      hidden: ({ document }) => document?.heroStyle === 'video',
      validation: (Rule) =>
        Rule.min(2).max(30).required().error('Duration must be between 2 and 30 seconds'),
    }),
    defineField({
      name: 'heroDefaultContentPosition',
      type: 'string',
      title: 'Content Position',
      description:
        'Choose where to position the content on desktop. On mobile, content is always centered above the images.',
      options: {
        list: [
          { title: 'Center Left', value: 'center-left' },
          { title: 'Center Right', value: 'center-right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center-left',
      hidden: ({ document }) => document?.heroStyle !== 'default',
    }),
    defineField({
      name: 'heroContentPosition',
      type: 'string',
      title: 'Content Position',
      description:
        'Choose where to position the hero content over the background. Note: On mobile devices, content is always centered horizontally - only the vertical positioning (top/center/bottom) is applied. Full positioning applies on desktop and larger screens.',
      options: {
        list: [
          { title: 'Top Left', value: 'top-left' },
          { title: 'Top Center', value: 'top-center' },
          { title: 'Top Right', value: 'top-right' },
          { title: 'Center Left', value: 'center-left' },
          { title: 'Center Center', value: 'center-center' },
          { title: 'Center Right', value: 'center-right' },
          { title: 'Bottom Left', value: 'bottom-left' },
          { title: 'Bottom Center', value: 'bottom-center' },
          { title: 'Bottom Right', value: 'bottom-right' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'center-center',
      hidden: ({ document }) => document?.heroStyle === 'default',
    }),
    defineField({
      name: 'h1Title',
      type: 'string',
      title: 'H1 Title (SEO & Accessibility)',
      description:
        '⚠️ IMPORTANT: This heading is for SEO and screen readers to understand the page content. It will be hidden from the visual UI. The Main Title and Sub Title below are what users will see.',
      validation: (Rule) => Rule.required().error('H1 Title is required for SEO and accessibility'),
    }),
    defineField({
      name: 'mainTitle',
      type: 'text',
      title: 'Main Title',
      description:
        'Main visual heading for the hero section. Supports line breaks (press Enter for new line). Use {curly braces} around text to make it white. Example: "Welcome to {My} Company" - the rest will be orange.',
      rows: 3,
    }),
    defineField({
      name: 'subTitle',
      type: 'text',
      title: 'Sub Title',
      description:
        'Optional subtitle for the hero section. Supports line breaks (press Enter for new line). Use {curly braces} around text to make it orange. Example: "Professional {Development} Services" - the rest will be white.',
      rows: 2,
    }),
    createCTAListField({
      name: 'heroCallToActionList',
      title: 'Call to Action Buttons',
      description:
        'Add one or multiple call-to-action buttons to the hero section. Leave empty if no CTAs are needed.',
    }),
    defineField({
      name: 'hideScrollIndicator',
      type: 'boolean',
      title: 'Hide Scroll Indicator',
      description:
        'Turn this switch ON to hide the scroll indicator arrow. By default (OFF), the scroll indicator is visible to guide users to scroll down.',
      initialValue: false,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Hero',
        subtitle: 'Home page hero section',
      };
    },
  },
});
