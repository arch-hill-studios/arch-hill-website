import { createSectionSchema } from './shared/sectionFactory';

export const subSubSectionType = createSectionSchema({
  name: 'subSubSection',
  title: 'Sub Sub Section',
  description: 'A sub-sub-section that can only be added within a Sub Section (will render as h4)',
  icon: '📑',
  hasSubtitle: false,
  allowedChildSections: [], // No further nesting allowed
});