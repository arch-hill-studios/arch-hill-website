import { defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';
import { createCTAButtonFields, createCTAButtonPreview } from './ctaButtonHelpers';

export const homeHeroCtaButtonType = defineType({
  name: 'homeHeroCtaButton',
  title: 'Home Hero CTA Button',
  type: 'object',
  icon: LinkIcon,
  description: 'Call to action button specifically for the home hero section',
  fields: createCTAButtonFields({
    includeAlignment: false,
    includeVariant: false, // This removes the Button Style option
    groups: [], // No groups for embedded use
  }),
  preview: createCTAButtonPreview(),
});