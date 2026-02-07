// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { createLinkFieldSet } from '../shared/linkSystem';

export const verticalNavLinkType = defineType({
  name: 'verticalNavLink',
  title: 'Vertical Navigation Link',
  type: 'object',
  fields: [
    defineField({
      name: 'hideLink',
      title: 'Hide Link',
      type: 'boolean',
      description:
        'Hide this navigation link from being displayed in the navigation. Useful for temporarily disabling links without deleting them.',
      initialValue: false,
    }),
    defineField({
      name: 'hideOnDesktop',
      title: 'Hide on Desktop',
      type: 'boolean',
      description: 'Hide this navigation item on desktop. Items remain visible on mobile.',
      initialValue: false,
    }),
    defineField({
      name: 'label',
      title: 'Link Label',
      type: 'string',
      description: 'The text that will be displayed for this navigation link',
      validation: (Rule) => Rule.required().error('Link label is required'),
    }),
    ...createLinkFieldSet({
      linkTypeConfig: {
        description: 'Choose whether this links to another page on your site or an external URL',
      },
      internalLinkConfig: {
        description: 'Select a page from your website. If left empty, will link to the home page',
      },
      externalUrlConfig: {
        description: 'Enter the full URL (e.g., https://example.com)',
        placeholder: 'https://example.com',
      },
      openInNewTabConfig: {
        description: 'Check this to open the link in a new tab/window',
      },
      pageSectionConfig: {
        description:
          'Select a section from the chosen page to link directly to it. Use the dropdown to choose from available sections.',
      },
    }),
  ],
  preview: {
    select: {
      title: 'label',
      hideLink: 'hideLink',
      hideOnDesktop: 'hideOnDesktop',
      linkType: 'linkType',
      internalLinkTitle: 'internalLink.title',
      internalLinkName: 'internalLink.name',
      internalLinkType: 'internalLink._type',
      externalUrl: 'externalUrl',
      pageSectionId: 'pageSectionId',
    },
    prepare(selection) {
      const {
        title,
        hideLink,
        hideOnDesktop,
        linkType,
        internalLinkTitle,
        internalLinkName,
        internalLinkType,
        externalUrl,
        pageSectionId,
      } = selection;
      let subtitle = '';

      if (linkType === 'internal') {
        let pageName = '';
        if (internalLinkTitle) {
          pageName = internalLinkTitle;
        } else if (internalLinkName) {
          pageName = internalLinkName;
        } else if (internalLinkType === 'homePage') {
          pageName = 'Home Page';
        } else if (internalLinkType) {
          pageName = internalLinkType;
        } else {
          pageName = 'Home Page (default)';
        }

        subtitle = `→ ${pageName}`;

        // Append anchor ID if specified
        if (pageSectionId) {
          subtitle += ` → #${pageSectionId}`;
        }
      } else if (linkType === 'external') {
        subtitle = externalUrl ? `→ ${externalUrl}` : '→ No URL specified';
      } else {
        subtitle = '→ Link type not specified';
      }

      const titlePrefix = hideLink ? '🚫 ' : '';
      const desktopPrefix = hideOnDesktop ? '🖥️ ' : '';
      const statusSuffix = hideLink ? ' (Hidden)' : hideOnDesktop ? ' (Hidden on Desktop)' : '';

      return {
        title: `${titlePrefix}${desktopPrefix}${title || 'Navigation Link'}${statusSuffix}`,
        subtitle,
      };
    },
  },
});
