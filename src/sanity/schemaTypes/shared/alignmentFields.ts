import { defineField } from 'sanity';

/**
 * Reusable alignment field configuration for blocks that support responsive text alignment.
 *
 * This provides a standardized alignment system used across multiple block types:
 * - Rich Text blocks
 * - Item List blocks
 * - And other blocks that need alignment control
 *
 * Usage:
 * Import and spread these fields into your block schema:
 *
 * ```typescript
 * import { alignmentFields } from '../shared/alignmentFields';
 *
 * export const myBlockType = defineType({
 *   name: 'myBlock',
 *   fields: [
 *     ...alignmentFields,
 *     // other fields
 *   ]
 * });
 * ```
 */
export const alignmentFields = [
  defineField({
    name: 'alignmentMode',
    title: 'Alignment Mode',
    type: 'string',
    description: 'Choose how to handle text alignment for this block',
    options: {
      list: [
        { title: 'Inherit', value: 'inherit' },
        { title: 'Override', value: 'override' },
      ],
      layout: 'radio',
    },
    initialValue: 'inherit',
  }),
  defineField({
    name: 'desktopAlignment',
    title: 'Desktop Alignment',
    type: 'string',
    description: 'Text alignment on desktop screens',
    options: {
      list: [
        { title: 'Left', value: 'left' },
        { title: 'Center', value: 'center' },
        { title: 'Right', value: 'right' },
      ],
      layout: 'radio',
    },
    initialValue: 'center',
    hidden: ({ parent }) => parent?.alignmentMode !== 'override',
  }),
  defineField({
    name: 'mobileAlignment',
    title: 'Mobile Alignment',
    type: 'string',
    description: 'Text alignment on mobile screens',
    options: {
      list: [
        { title: 'Left', value: 'left' },
        { title: 'Center', value: 'center' },
        { title: 'Right', value: 'right' },
      ],
      layout: 'radio',
    },
    initialValue: 'center',
    hidden: ({ parent }) => parent?.alignmentMode !== 'override',
  }),
];
