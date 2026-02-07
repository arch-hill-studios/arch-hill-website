import { defineField, defineType } from 'sanity';
import { UlistIcon } from '@sanity/icons';
import { alignmentFields } from '../shared/alignmentFields';

export const itemListType = defineType({
  name: 'itemList',
  title: 'Item List',
  type: 'object',
  icon: UlistIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'List Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    ...alignmentFields,
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
            select: { title: 'text' },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({ title, items }) {
      const itemCount = items?.length || 0;
      return {
        title: title || 'Item List',
        subtitle: `${itemCount} item${itemCount !== 1 ? 's' : ''}`,
      };
    },
  },
});
