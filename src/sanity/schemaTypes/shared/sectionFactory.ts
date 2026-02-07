import { defineType, defineField, type FieldDefinition } from 'sanity';
import { AnchorIdInput } from '../../components/AnchorIdInput';
import { createSectionBlockList } from './blockLists';
import { createBackgroundFields } from './backgroundStyles';

interface SectionFactoryConfig {
  name: string;
  title: string;
  description: string;
  icon: string;
  hasSubtitle?: boolean;
  allowedChildSections?: string[];
}

export function createSectionSchema(config: SectionFactoryConfig) {
  const fields: FieldDefinition[] = [
    defineField({
      name: 'hideSection',
      title: 'Hide Section',
      type: 'boolean',
      description:
        'Hide this section and all its content from the frontend. Useful for temporarily disabling sections without deleting them. ⚠️ Warning: Any navigation links that point to this section will not work while it is hidden. Consider hiding those navigation links as well.',
      initialValue: false,
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: `Title for this ${config.title.toLowerCase()} (will render as ${config.name === 'pageSection' ? 'h2' : config.name === 'subSection' ? 'h3' : config.name === 'subSubSection' ? 'h4' : 'heading'}). Use {curly braces} around text to make it white. Example: "Welcome to {My} Company" - the rest will be orange.`,
      validation: (Rule) => Rule.required().error(`${config.title} title is required`),
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      description:
        'Auto-generated from the section title. This field is read-only to prevent errors. Use the "Regenerate" button to recreate the ID if needed.',
      components: {
        input: AnchorIdInput,
      },
      validation: (Rule) =>
        Rule.required()
          .error('Anchor ID is required for section linking')
          .custom((value, context) => {
            if (!value) return true;

            // Check for valid format
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
              return 'Anchor ID must be lowercase letters, numbers, and hyphens only (e.g., about-our-services)';
            }

            // Get the current document and check for duplicate anchor IDs
            const document = context.document as { content?: unknown[] };
            if (!document?.content) return true;

            // Flatten all content to find sections
            const getAllSections = (
              content: unknown[],
            ): { _type: string; anchorId?: string; _key?: string }[] => {
              const sections: { _type: string; anchorId?: string; _key?: string }[] = [];
              for (const item of content || []) {
                const typedItem = item as {
                  _type: string;
                  content?: unknown[];
                  anchorId?: string;
                  _key?: string;
                };
                if (
                  typedItem._type === 'pageSection' ||
                  typedItem._type === 'subSection' ||
                  typedItem._type === 'subSubSection'
                ) {
                  sections.push(typedItem);
                  if (typedItem.content) {
                    sections.push(...getAllSections(typedItem.content));
                  }
                }
              }
              return sections;
            };

            const allSections = getAllSections(document.content);
            const currentSection = context.parent as { _key?: string };

            // Count occurrences of this anchor ID (excluding current section being edited)
            const duplicates = allSections.filter(
              (section) => section.anchorId === value && section._key !== currentSection?._key,
            );

            if (duplicates.length > 0) {
              return `Anchor ID "${value}" already exists on this page. Each section must have a unique anchor ID.`;
            }

            return true;
          }),
    }),
  ];

  // Add subtitle field for PageSection only - insert after anchor ID (position 3 now, since titleTranslation is at position 2)
  if (config.hasSubtitle) {
    fields.splice(
      3,
      0,
      defineField({
        name: 'subtitle',
        title: 'Section Subtitle',
        type: 'text',
        description: 'Optional subtitle for this section',
      }),
    );
  }

  // Add topText field for PageSection only - insert after subtitle (or after anchor ID if no subtitle)
  if (config.name === 'pageSection') {
    const insertPosition = config.hasSubtitle ? 4 : 3;
    fields.splice(
      insertPosition,
      0,
      defineField({
        name: 'topText',
        title: 'Top Text',
        type: 'string',
        description:
          'Optional text displayed at the top of the section. Can be used for posting dates, timestamps, or any contextual information.',
      }),
    );
  }

  // Add compact gap field for PageSection only - insert after topText or at appropriate position
  if (config.name === 'pageSection') {
    const insertPosition = config.hasSubtitle ? 5 : 4;
    fields.splice(
      insertPosition,
      0,
      defineField({
        name: 'useCompactGap',
        title: 'Use Compact Gap After Section',
        type: 'boolean',
        description:
          'Add a smaller gap after this section instead of the default spacing. Note: Gap size may be overridden by other layout rules depending on content placement. Large gaps work best for long sections with varied content, while compact gaps suit shorter text-focused sections.',
        initialValue: false,
      }),
    );
  }

  // Add background fields (style + image) for PageSection only - insert after useCompactGap
  if (config.name === 'pageSection') {
    const insertPosition = config.hasSubtitle ? 6 : 5;
    const backgroundFields = createBackgroundFields('section');
    fields.splice(insertPosition, 0, ...backgroundFields);
  }

  // Add two-column layout toggle for PageSection only - insert after background fields
  if (config.name === 'pageSection') {
    const insertPosition = config.hasSubtitle ? 8 : 7;
    fields.splice(
      insertPosition,
      0,
      defineField({
        name: 'twoColumnLayout',
        title: 'Enable Two-Column Layout',
        type: 'boolean',
        description:
          'When enabled, the section heading and subtitle will appear in the left column, and you can add content to both the left column (below the heading) and a separate right column. On mobile, left column content appears first, followed by right column content.',
        initialValue: false,
      }),
    );
  }

  // Build content array with allowed child sections and standard blocks
  const contentOf = createSectionBlockList(config.allowedChildSections);

  // For PageSection, make the content field title conditional based on twoColumnLayout
  const contentFieldTitle = config.name === 'pageSection' ? 'Left Column Content' : 'Content';

  const contentFieldDescription =
    config.name === 'pageSection'
      ? 'Content for the left column (below the heading/subtitle). When two-column layout is disabled, this is the main content area.'
      : undefined;

  fields.push(
    defineField({
      name: 'content',
      title: contentFieldTitle,
      type: 'array',
      of: contentOf,
      description: contentFieldDescription,
    }),
  );

  // Add right column field for PageSection only (when twoColumnLayout is enabled)
  if (config.name === 'pageSection') {
    fields.push(
      defineField({
        name: 'rightColumn',
        title: 'Right Column Content',
        type: 'array',
        of: contentOf,
        description: 'Content for the right column (appears after left column on mobile).',
        hidden: ({ parent }) => !parent?.twoColumnLayout,
      }),
    );
  }

  return defineType({
    name: config.name,
    title: config.title,
    type: 'object',
    description: config.description,
    icon: () => config.icon,
    fields,
    preview: {
      select: {
        title: 'title',
        hideSection: 'hideSection',
        ...(config.hasSubtitle && { subtitle: 'subtitle' }),
        ...(config.name === 'pageSection' && { topText: 'topText' }),
        content: 'content',
      },
      prepare(selection: {
        title?: string;
        hideSection?: boolean;
        subtitle?: string;
        topText?: string;
        content?: unknown[];
      }) {
        const { title, hideSection, subtitle, content } = selection;
        const blockCount = Array.isArray(content) ? content.length : 0;
        const displaySubtitle = subtitle
          ? `${subtitle.slice(0, 50)}${subtitle.length > 50 ? '...' : ''}`
          : `${blockCount} block${blockCount !== 1 ? 's' : ''}`;

        const titlePrefix = hideSection ? '🚫 ' : '';
        const statusSuffix = hideSection ? ' (Hidden)' : '';

        return {
          title: `${titlePrefix}${title || config.title}${statusSuffix}`,
          subtitle: displaySubtitle,
        };
      },
    },
  });
}
