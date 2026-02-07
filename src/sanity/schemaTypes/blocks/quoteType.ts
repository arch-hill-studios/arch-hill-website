import { defineField, defineType } from 'sanity';
import { BlockquoteIcon } from '@sanity/icons';

export const quoteType = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Quote Text',
      type: 'text',
      description: 'The main quote text',
      rows: 4,
      validation: (Rule) => Rule.required().error('Quote text is required'),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Who said this quote? (optional)',
      placeholder: 'e.g., John Doe, CEO of Company',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      description: 'Text alignment for this quote (overrides section/page alignment)',
      options: {
        list: [
          { title: 'Inherit', value: 'inherit' },
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'inherit',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      attribution: 'attribution',
    },
    prepare({ text, attribution }) {
      const previewText = text || 'Quote';
      const truncatedText =
        previewText.length > 50 ? `${previewText.substring(0, 50)}...` : previewText;

      return {
        title: `"${truncatedText}"`,
        subtitle: attribution ? `— ${attribution}` : 'Quote Block',
        media: BlockquoteIcon,
      };
    },
  },
});
