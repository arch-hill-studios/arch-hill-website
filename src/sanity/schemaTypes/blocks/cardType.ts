// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';
import { createLinkFieldSet } from '../shared/linkSystem';

export const cardType = defineType({
  name: 'card',
  title: 'Card',
  type: 'object',
  icon: DocumentIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'cta',
      title: 'Call to Action',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'The main heading of the card',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      group: 'content',
      description: 'The main content text of the card',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'cta',
      description: 'Text displayed on the call-to-action button',
      validation: (Rule) => Rule.required().max(50),
    }),
    ...createLinkFieldSet({ group: 'cta' }),
  ],
  preview: {
    select: {
      title: 'title',
      body: 'body',
      ctaText: 'ctaText',
      linkType: 'linkType',
      internalLinkTitle: 'internalLink.title',
      externalUrl: 'externalUrl',
    },
    prepare({ title, body, ctaText, linkType, internalLinkTitle, externalUrl }) {
      const bodyPreview = body ? body.slice(0, 60) + (body.length > 60 ? '...' : '') : '';

      let linkInfo = '';
      if (linkType === 'internal' && internalLinkTitle) {
        linkInfo = ` → ${internalLinkTitle}`;
      } else if (linkType === 'external' && externalUrl) {
        try {
          const url = new URL(externalUrl);
          linkInfo = ` → ${url.hostname}`;
        } catch {
          linkInfo = ' → External URL';
        }
      }

      return {
        title: title || 'Untitled Card',
        subtitle: `${ctaText}${linkInfo} | ${bodyPreview}`,
        media: DocumentIcon,
      };
    },
  },
});
