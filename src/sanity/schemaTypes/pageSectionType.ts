import { createSectionSchema } from './shared/sectionFactory';

export const pageSectionType = createSectionSchema({
  name: 'pageSection',
  title: 'Page Section',
  description: 'A page-level section with title, subtitle, and content blocks (will render as h2)',
  icon: '📋',
  hasSubtitle: true,
  allowedChildSections: ['subSection'],
});