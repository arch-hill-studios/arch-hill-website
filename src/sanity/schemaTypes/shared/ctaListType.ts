// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType, defineArrayMember } from 'sanity';

/**
 * Reusable CTA list array type that can be used in various components
 * Allows editors to add multiple CTA buttons (regular link buttons or email buttons)
 */
export const ctaListType = defineType({
  name: 'ctaList',
  title: 'CTA List',
  type: 'array',
  description: 'List of call-to-action buttons - can be empty, or contain one or multiple CTAs',
  of: [
    defineArrayMember({
      type: 'embeddedCtaButton',
      title: 'CTA Button',
    }),
  ],
  options: {
    insertMenu: {
      views: [
        {
          name: 'list',
        },
      ],
    },
  },
});

/**
 * Helper function to create a CTA list field with custom options
 * Use this when you want to customize the title, description, or validation
 */
export const createCTAListField = (options: {
  name?: string;
  title?: string;
  description?: string;
  group?: string;
  maxItems?: number;
  validation?: boolean;
} = {}) => {
  const {
    name = 'ctaList',
    title = 'Call to Action Buttons',
    description = 'Add one or multiple call-to-action buttons. Leave empty if no CTAs are needed.',
    group,
    maxItems,
    validation = false,
  } = options;

  return defineField({
    name,
    title,
    type: 'ctaList',
    group,
    description,
    validation: validation 
      ? (Rule) => Rule.required().min(1).error('Please add at least one CTA button')
      : maxItems 
        ? (Rule) => Rule.max(maxItems).error(`Maximum ${maxItems} CTA buttons allowed`)
        : undefined,
  });
};