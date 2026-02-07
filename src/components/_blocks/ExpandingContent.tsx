import { renderBlock } from '@/utils/blockRenderer';
import type { ExpandingContent as ExpandingContentType } from '@/sanity/types';
import type { PageBuilderData } from '@/actions';
import ExpandingContentWrapper from '../UI/ExpandingContentWrapper';

interface ExpandingContentProps extends Omit<ExpandingContentType, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  pathPrefix?: string;
  pageBuilderData: PageBuilderData;
  alignment?: 'left' | 'center' | 'right';
}

const ExpandingContent = ({
  showOnDesktop = false,
  expandingContent,
  expandLabel = 'Read More',
  collapseLabel = 'Read Less',
  className = '',
  documentId,
  documentType,
  pathPrefix = '',
  pageBuilderData,
  alignment = 'center',
}: ExpandingContentProps) => {
  return (
    <ExpandingContentWrapper
      showOnDesktop={showOnDesktop}
      expandLabel={expandLabel}
      collapseLabel={collapseLabel}
      className={className}>
      {expandingContent && expandingContent.length > 0 && (
        <div>
          {expandingContent.map((block, index) =>
            renderBlock(block, {
              documentId,
              documentType,
              blockPath: pathPrefix
                ? `${pathPrefix}.expandingContent[${index}]`
                : `expandingContent[${index}]`,
              pageBuilderData,
              alignment,
              config:
                documentId && documentType
                  ? {
                      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
                      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
                    }
                  : undefined,
            })
          )}
        </div>
      )}
    </ExpandingContentWrapper>
  );
};

export default ExpandingContent;
