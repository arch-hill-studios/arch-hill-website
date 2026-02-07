import { defineType, defineField } from 'sanity';
import { RemoveIcon } from '@sanity/icons';

export const dividerType = defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  icon: RemoveIcon,
  options: {
    columns: 1,
    collapsible: false,
  },
  fields: [
    defineField({
      name: 'style',
      title: 'Divider Added!',
      type: 'string',
      initialValue: 'You can close this dialog',
      readOnly: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: ' --- Divider ---',
        subtitle: 'Decorative section divider',
      };
    },
  },
});
