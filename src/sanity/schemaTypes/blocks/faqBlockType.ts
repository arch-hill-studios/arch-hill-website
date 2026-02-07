// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { HelpCircleIcon } from '@sanity/icons';
import { defineField, defineType, defineArrayMember } from 'sanity';

export const faqBlockType = defineType({
  name: 'faqBlock',
  title: 'FAQ Block',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      description: 'Add frequently asked questions and their answers. Items can be reordered by dragging.',
      validation: (Rule) => Rule.required().min(1).error('At least one FAQ item is required'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          icon: HelpCircleIcon,
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required().error('Question is required'),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required().error('Answer is required'),
            }),
          ],
          preview: {
            select: {
              question: 'question',
              answer: 'answer',
            },
            prepare({ question, answer }) {
              return {
                title: question || 'Untitled Question',
                subtitle: answer ? (answer.length > 60 ? `${answer.substring(0, 60)}...` : answer) : 'No answer provided',
                media: HelpCircleIcon,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      faqItems: 'faqItems',
    },
    prepare({ faqItems }) {
      const itemCount = faqItems?.length || 0;
      return {
        title: 'FAQ Block',
        subtitle: `${itemCount} question${itemCount !== 1 ? 's' : ''}`,
        media: HelpCircleIcon,
      };
    },
  },
});
