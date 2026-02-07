// AI Helper: This file contains shared configuration for background styles used across multiple schema types.
// When modifying, ensure changes are reflected in both ContentWrapper and PageSection schemas.

import { defineField } from 'sanity';

/**
 * Shared list of background style options for ContentWrapper and PageSection
 * This ensures consistency across all components that use background styling
 */
export const BACKGROUND_STYLE_OPTIONS = [
  { title: 'None', value: '' },
  { title: 'Smokey 1', value: 'smokey-1' },
  { title: 'Smokey 2', value: 'smokey-2' },
  { title: 'Smokey 3', value: 'smokey-3' },
  { title: 'Smokey 4', value: 'smokey-4' },
  { title: 'Smokey 5', value: 'smokey-5' },
  { title: 'Smokey 6', value: 'smokey-6' },
  { title: 'Smokey 7', value: 'smokey-7' },
  { title: 'Smokey 8', value: 'smokey-8' },
  { title: 'Radial Gradient', value: 'radial-gradient' },
  { title: 'Image', value: 'image' },
];

/**
 * Creates the background style and background image fields
 * Use this function to ensure consistency across ContentWrapper and PageSection schemas
 *
 * @param contextDescription - Description context (e.g., "content area", "section")
 * @returns Array of field definitions for backgroundStyle and backgroundImage
 */
export function createBackgroundFields(contextDescription: string) {
  return [
    defineField({
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'string',
      description: `Optional background styling for this ${contextDescription}. If left blank, no background will be applied. If selected, will apply that background style.`,
      options: {
        list: BACKGROUND_STYLE_OPTIONS,
        layout: 'dropdown',
      },
      initialValue: '',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Upload a background image (only used when Background Style is set to "Image")',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.backgroundStyle !== 'image',
    }),
  ];
}
