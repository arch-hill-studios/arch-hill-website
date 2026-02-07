import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';
import { alignmentFields } from '../shared/alignmentFields';

export const richTextType = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'isCallout',
      title: 'Callout Style',
      type: 'boolean',
      description:
        'Apply emphasized styling with background and border to make this text more prominent',
      initialValue: false,
    }),
    ...alignmentFields,
    // Keep the old textAlign field for backwards compatibility
    defineField({
      name: 'textAlign',
      title: 'Text Alignment (Legacy)',
      type: 'string',
      hidden: true,
      options: {
        list: [
          { title: 'Inherit', value: 'inherit' },
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'inherit',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required().error('Rich text content is required'),
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      // Try to extract the first text block for preview
      const firstBlock = Array.isArray(content) ? content[0] : null;
      const previewText = firstBlock?.children?.[0]?.text || 'Rich Text';

      return {
        title: previewText.length > 40 ? `${previewText.substring(0, 40)}...` : previewText,
        subtitle: 'Rich Text Block',
        media: DocumentTextIcon,
      };
    },
  },
});
