import { defineType } from 'sanity';
import { PAGE_ROOT_BLOCK_LIST } from './shared/blockLists';

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page Builder',
  type: 'array',
  of: PAGE_ROOT_BLOCK_LIST,
  options: {
    insertMenu: {
      views: [
        {
          name: 'list',
        },
      ],
    },
    // Improve the modal experience
    modal: { type: 'dialog' },
  },
  // Clear description for editors
  description:
    'Build your page by adding Page Sections (with headings) or Content Wrappers (for grouping blocks without headings). All individual content blocks must be placed inside one of these containers.',
});
