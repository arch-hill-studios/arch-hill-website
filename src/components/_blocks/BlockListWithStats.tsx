import React from 'react';
import type { BlockListWithStatsBlock } from '@/types/blocks';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { maxCardWidth } from '@/utils/spacingConstants';

interface BlockListWithStatsProps extends Omit<BlockListWithStatsBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const BlockListWithStats = ({
  items = [],
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: BlockListWithStatsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      {items.map((item, index) => {
        const itemPath = fieldPathPrefix ? `${fieldPathPrefix}.items[${index}]` : `items[${index}]`;

        return (
          <div
            key={item._key}
            className={`flex items-center justify-between mx-auto w-full ${maxCardWidth} px-4 py-3 bg-brand-white-dark shadow-sm rounded-lg`}>
            {/* Left Hand Side (primary) content */}
            <div className='flex-shrink-0'>
              <span
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${itemPath}.leftContent`)
                  : {})}
                className='text-body-lg font-bold'>
                {item.leftContent}
              </span>
            </div>

            {/* Right Hand Side (secondary) content */}
            <div className='flex-shrink-0 text-right'>
              {item.rightContent && (
                <span
                  {...(documentId && documentType
                    ? createSanityDataAttribute(
                        documentId,
                        documentType,
                        `${itemPath}.rightContent`
                      )
                    : {})}
                  className='text-body-base'>
                  {item.rightContent}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlockListWithStats;
