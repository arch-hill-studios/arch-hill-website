// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineArrayMember, defineField, defineType } from 'sanity';
import { ThListIcon } from '@sanity/icons';

export const gearListType = defineType({
  name: 'gearList',
  title: 'Gear List',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Add and reorder gear categories. Each category has a title and a list of items.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'gearCategory',
          title: 'Category',
          fields: [
            defineField({
              name: 'title',
              title: 'Category Title',
              type: 'string',
              validation: (Rule) => Rule.required().min(1).max(100),
              description: 'The name of this gear category (e.g., "Microphones", "PA System").',
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              description: 'Add and reorder the gear items in this category.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'gearItem',
                  title: 'Item',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Item Text',
                      type: 'string',
                      validation: (Rule) => Rule.required().min(1).max(300),
                      description: 'The name or description of this gear item.',
                    }),
                  ],
                  preview: {
                    select: {
                      text: 'text',
                    },
                    prepare({ text }) {
                      return {
                        title: text || 'Untitled Item',
                      };
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1).max(100),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              items: 'items',
            },
            prepare({ title, items }) {
              const count = items?.length || 0;
              return {
                title: title || 'Untitled Category',
                subtitle: `${count} item${count !== 1 ? 's' : ''}`,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
  ],
  preview: {
    select: {
      categories: 'categories',
    },
    prepare({ categories }) {
      const count = categories?.length || 0;
      return {
        title: 'Gear List',
        subtitle: `${count} categor${count !== 1 ? 'ies' : 'y'}`,
      };
    },
  },
});
