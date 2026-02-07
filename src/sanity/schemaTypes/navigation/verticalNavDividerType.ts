import { defineType, defineField } from 'sanity';
import { RemoveIcon } from '@sanity/icons';

export const verticalNavDividerType = defineType({
  name: 'verticalNavDivider',
  title: 'Vertical Navigation Divider',
  type: 'object',
  icon: RemoveIcon,
  options: {
    columns: 2,
    collapsible: false,
  },
  fields: [
    defineField({
      name: 'hideOnDesktop',
      title: 'Hide on Desktop',
      type: 'boolean',
      description: 'Hide this divider on desktop. Divider remains visible on mobile.',
      initialValue: false,
    }),
    defineField({
      name: 'style',
      title: 'Divider Added!',
      type: 'string',
      initialValue: 'You can close this dialog',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      hideOnDesktop: 'hideOnDesktop',
    },
    prepare(selection) {
      const { hideOnDesktop } = selection;
      const desktopPrefix = hideOnDesktop ? '🖥️ ' : '';
      const statusSuffix = hideOnDesktop ? ' (Hidden on Desktop)' : '';

      return {
        title: `${desktopPrefix}--- Divider ---${statusSuffix}`,
        subtitle: 'Decorative section divider',
      };
    },
  },
});
