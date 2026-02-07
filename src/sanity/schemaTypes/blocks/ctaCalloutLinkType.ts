import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';
import { createLinkFieldSet } from '../shared/linkSystem';

export const ctaCalloutLinkType = defineType({
  name: 'ctaCalloutLink',
  title: 'CTA Callout Link',
  type: 'object',
  icon: LinkIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'link',
      title: 'Link',
    },
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading (Optional)',
      type: 'string',
      group: 'content',
      description: 'Optional heading text - will be displayed in bold and larger',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'text',
      title: 'Text (Optional)',
      type: 'text',
      group: 'content',
      description: 'Optional main text content - supports line breaks',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'image',
      title: 'Image (Optional)',
      type: 'image',
      group: 'content',
      description: 'Optional image - will be displayed in a circular frame',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Helps explain what the image is for SEO and screen readers. Highly recommended to provide something that describes the image; if not provided, the system will try to come up with something.',
        }),
      ],
    }),
    ...createLinkFieldSet({ group: 'link' }),
  ],
  preview: {
    select: {
      heading: 'heading',
      text: 'text',
      linkType: 'linkType',
      internalLinkTitle: 'internalLink.title',
      internalLinkName: 'internalLink.name',
      internalLinkType: 'internalLink._type',
      internalLinkSlug: 'internalLink.slug.current',
      externalUrl: 'externalUrl',
      openInNewTab: 'openInNewTab',
      pageSection: 'pageSectionId',
      imageAsset: 'image.asset',
    },
    prepare({ heading, text, linkType, internalLinkTitle, internalLinkName, internalLinkType, internalLinkSlug, externalUrl, openInNewTab, pageSection, imageAsset }) {
      const title = heading || (text ? text.slice(0, 50) + (text.length > 50 ? '...' : '') : 'Callout Link');

      let linkInfo = 'No link';
      if (linkType === 'internal') {
        let pageName = '';
        if (internalLinkTitle) {
          pageName = internalLinkTitle;
        } else if (internalLinkName) {
          pageName = internalLinkName;
        } else if (internalLinkSlug) {
          pageName = `/${internalLinkSlug}`;
        } else if (internalLinkType === 'homePage') {
          pageName = 'Home Page';
        } else if (internalLinkType) {
          pageName = internalLinkType;
        } else {
          pageName = 'Home Page (default)';
        }

        const sectionIndicator = pageSection ? ` #${pageSection}` : '';
        const newTabIndicator = openInNewTab ? ' ↗' : '';
        linkInfo = `→ ${pageName}${sectionIndicator}${newTabIndicator}`;
      } else if (linkType === 'external' && externalUrl) {
        try {
          const url = new URL(externalUrl);
          linkInfo = `→ ${url.hostname} ↗`;
        } catch {
          linkInfo = '→ External URL ↗';
        }
      }

      return {
        title,
        subtitle: linkInfo,
        media: imageAsset || LinkIcon,
      };
    },
  },
});