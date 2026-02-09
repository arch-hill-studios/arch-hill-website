import React from 'react';
import Icon from '@/lib/iconLibrary';
import type { IconKey } from '@/lib/iconLibrary';
import type { DetailedList as DetailedListType } from '@/sanity/types';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import AnimateIn from '@/components/UI/AnimateIn';

interface DetailedListProps extends Omit<DetailedListType, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const DetailedList = ({
  items = [],
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: DetailedListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center w-full ${className}`.trim()}>
      <div className='space-y-10 w-full'>
        {items.map((item, index) => {
          const itemPath = fieldPathPrefix
            ? `${fieldPathPrefix}.items[${index}]`
            : `items[${index}]`;

          const hasIcon = !!item.icon;

          return (
            <div key={item._key} className='w-full'>
              {/* Title */}
              <p
                className='text-h4 font-bold text-brand-primary mb-4'
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${itemPath}.title`)
                  : {})}>
                {item.title}
              </p>

              {/* Icon and Description Container */}
              <div className={`flex ${hasIcon ? 'gap-6' : ''} items-start`}>
                {/* Icon (if provided) */}
                {hasIcon && (
                  <AnimateIn
                    animation='fade'
                    trigger='scroll'
                    duration={800}
                    delay={index * 100}
                    threshold={0.2}>
                    <div
                      className='shrink-0'
                      {...(documentId && documentType
                        ? createSanityDataAttribute(documentId, documentType, `${itemPath}.icon`)
                        : {})}>
                      <Icon
                        iconKey={item.icon as IconKey}
                        width={2.5}
                        colorClassName='text-brand-primary'
                      />
                    </div>
                  </AnimateIn>
                )}

                {/* Description */}
                <AnimateIn
                  animation='slideUp'
                  trigger='scroll'
                  duration={800}
                  delay={index * 100 + 150}
                  threshold={0.2}
                  className='flex-1'>
                  <div className='text-body-lg'>
                    <p
                      {...(documentId && documentType
                        ? createSanityDataAttribute(
                            documentId,
                            documentType,
                            `${itemPath}.description`
                          )
                        : {})}
                      className='whitespace-pre-line'>
                      {item.description}
                    </p>
                  </div>
                </AnimateIn>
              </div>

              {/* Underline Border */}
              <div
                className='mt-6 h-[0.5px] bg-brand-primary'
                style={{ opacity: 0.2 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedList;
