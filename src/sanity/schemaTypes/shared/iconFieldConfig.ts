// AI Helper: This is a reusable icon field configuration for Sanity schemas.
// Use this to add icon selection functionality (library icons only) to any schema.

import { defineField } from 'sanity';
import IconSelector from '@/sanity/components/IconSelector';

/**
 * Creates a reusable icon field configuration that allows selecting from the icon library.
 *
 * @param options - Configuration options
 * @param options.required - Whether the icon is required (default: false)
 * @param options.description - Custom description for the icon field
 * @returns Field definition for icon selection
 */
export function createIconField(options: {
  required?: boolean;
  description?: string;
} = {}) {
  const { required = false, description = 'Select an icon from the library' } = options;

  return defineField({
    name: 'icon',
    title: 'Icon',
    type: 'string',
    components: {
      input: IconSelector,
    },
    validation: (Rule) => required ? Rule.required() : Rule,
    description,
  });
}
