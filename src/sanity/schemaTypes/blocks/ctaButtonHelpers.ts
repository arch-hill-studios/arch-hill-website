import { defineField } from 'sanity';
import { LinkIcon } from '@sanity/icons';
import { createLinkFieldSet } from '../shared/linkSystem';
import { alignmentFields } from '../shared/alignmentFields';

interface CTAButtonOptions {
  includeAlignment?: boolean;
  includeVariant?: boolean;
  name?: string;
  title?: string;
  description?: string;
  groups?: Array<{
    name: string;
    title: string;
  }>;
}

export const createCTAButtonFields = (options: CTAButtonOptions = {}) => {
  const {
    includeAlignment = true,
    includeVariant = true,
    groups = [
      { name: 'content', title: 'Content' },
      { name: 'styling', title: 'Styling' },
      { name: 'link', title: 'Link' },
    ],
  } = options;

  const fields: ReturnType<typeof defineField>[] = [
    defineField({
      name: 'text',
      title: 'Button Text',
      type: 'string',
      group: groups.length > 0 ? 'content' : undefined,
      description: 'The text that will appear on the button',
      validation: (Rule) => Rule.max(50),
    }),
  ];

  // Add variant field if requested
  if (includeVariant) {
    fields.push(
      defineField({
        name: 'variant',
        title: 'Button Style',
        type: 'string',
        group: groups.length > 0 ? 'styling' : undefined,
        options: {
          list: [
            { title: 'Filled (Default)', value: 'filled' },
            { title: 'Outline on Light Background', value: 'outline-light' },
            { title: 'Outline on Dark Background', value: 'outline-dark' },
            { title: 'Text Link with Chevron', value: 'text-link' },
          ],
        },
        initialValue: 'filled',
        description: 'Choose the visual style of the button',
      })
    );
  }

  // Add alignment fields if requested
  if (includeAlignment) {
    // Add the alignment fields with group assignment
    const fieldsWithGroups = alignmentFields.map(field => {
      // Only add group if groups are defined
      if (groups.length > 0) {
        return defineField({
          ...field,
          group: 'styling',
        });
      }
      return field;
    });

    fields.push(...fieldsWithGroups);
  }

  // Add link fields using the unified link system
  const linkFields = createLinkFieldSet({
    group: groups.length > 0 ? 'link' : undefined,
  });
  fields.push(...linkFields);

  return fields;
};

export const createCTAButtonPreview = () => ({
  select: {
    text: 'text',
    variant: 'variant',
    linkType: 'linkType',
    internalTitle: 'internalLink.title',
    externalUrl: 'externalUrl',
    openInNewTab: 'openInNewTab',
  },
  prepare({
    text,
    variant,
    linkType,
    internalTitle,
    externalUrl,
    openInNewTab,
  }: {
    text?: string;
    variant?: string;
    linkType?: string;
    internalTitle?: string;
    externalUrl?: string;
    openInNewTab?: boolean;
  }) {
    const buttonText = text || 'Untitled Button';
    const style =
      variant === 'outline-light' ? 'Outline (Light BG)' :
      variant === 'outline-dark' ? 'Outline (Dark BG)' :
      variant === 'text-link' ? 'Text Link' :
      'Filled';

    let linkInfo = 'No link';
    if (linkType === 'internal' && internalTitle) {
      const newTabIndicator = openInNewTab ? ' ↗' : '';
      linkInfo = `→ ${internalTitle}${newTabIndicator}`;
    } else if (linkType === 'external' && externalUrl) {
      try {
        const url = new URL(externalUrl);
        linkInfo = `→ ${url.hostname} ↗`;
      } catch {
        linkInfo = '→ External URL ↗';
      }
    }

    return {
      title: buttonText,
      subtitle: `${style} button • ${linkInfo}`,
      media: LinkIcon,
    };
  },
});
