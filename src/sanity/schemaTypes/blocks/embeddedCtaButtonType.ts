import { defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';
import { createCTAButtonFields, createCTAButtonPreview } from './ctaButtonHelpers';

export const embeddedCtaButtonType = defineType({
  name: 'embeddedCtaButton',
  title: 'CTA Button',
  type: 'object',
  icon: LinkIcon,
  fields: createCTAButtonFields({
    includeAlignment: false,
    includeVariant: true,
    groups: [], // No groups for embedded use
  }),
  preview: createCTAButtonPreview(),
});