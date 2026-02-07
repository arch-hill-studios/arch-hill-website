import { defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';
import { createCTAButtonFields, createCTAButtonPreview } from './ctaButtonHelpers';

export const ctaButtonType = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  icon: LinkIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'styling',
      title: 'Styling',
    },
    {
      name: 'link',
      title: 'Link',
    },
  ],
  fields: createCTAButtonFields({
    includeAlignment: true,
    includeVariant: true,
  }),
  preview: createCTAButtonPreview(),
});
