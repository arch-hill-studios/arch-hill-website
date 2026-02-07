import React from 'react';
import type { CheckListBlock } from '@/types/blocks';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { maxCardWidth } from '@/utils/spacingConstants';

interface CheckListProps extends Omit<CheckListBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const CheckList = ({
  items = [],
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: CheckListProps) => {
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
            className={`flex items-center gap-6 mx-auto w-full ${maxCardWidth} px-6 py-4 bg-brand-white-dark shadow-sm rounded-lg`}>
            {/* Checkmark icon */}
            <div className='p-1 rounded-full bg-brand-primary'>
              <svg
                className='w-4 h-4 text-brand-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>

            {/* Text content */}
            <div className='text-left'>
              <span
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${itemPath}.text`)
                  : {})}
                className='text-body-lg font-medium'>
                {item.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckList;
