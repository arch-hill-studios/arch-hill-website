import { createSectionSchema } from './shared/sectionFactory';

export const subSectionType = createSectionSchema({
  name: 'subSection',
  title: 'Sub Section',
  description: 'A sub-section that can only be added within a Page Section (will render as h3)',
  icon: '📄',
  hasSubtitle: false,
  allowedChildSections: ['subSubSection'],
});