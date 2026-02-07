import React from 'react';
import Icon from '@/lib/iconLibrary';
import type { IconKey } from '@/lib/iconLibrary';
import type { IconListBlock } from '@/types/blocks';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import AnimateIn from '@/components/UI/AnimateIn';

interface IconListProps extends Omit<IconListBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const IconList = ({
  items = [],
  layout = 'horizontal',
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: IconListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  const isHorizontal = layout === 'horizontal';
  // Stagger animation delays for each item (200ms between items)
  const baseDelay = 0;
  const staggerDelay = 200;

  return (
    <div className={`flex flex-col items-center w-full ${className}`.trim()}>
      <div className='space-y-8 md:space-y-12 w-full'>
        {items.map((item, index) => {
          const itemPath = fieldPathPrefix
            ? `${fieldPathPrefix}.items[${index}]`
            : `items[${index}]`;

          // Calculate delays for icon and text animations
          const iconDelay = baseDelay + index * staggerDelay;
          const textDelay = iconDelay + 100; // Text animates 100ms after icon

          return (
            <div
              key={item._key}
              className={`flex justify-center flex-col items-center gap-2 ${
                isHorizontal ? 'md:flex-row md:gap-6' : 'w-full'
              }`}>
              {/* Icon - Fade in */}
              <AnimateIn animation='fade' trigger='scroll' duration={600} delay={iconDelay}>
                <div
                  className={`flex justify-center items-center`}
                  {...(documentId && documentType
                    ? createSanityDataAttribute(documentId, documentType, `${itemPath}.icon`)
                    : {})}>
                  <Icon
                    iconKey={item.icon as IconKey}
                    width={3}
                    mobileWidth={2.5}
                    colorClassName='text-gradient-firey'
                  />
                </div>
              </AnimateIn>

              {/* Description - Slide in from right (horizontal) or bottom (vertical) + fade */}
              <AnimateIn
                animation={isHorizontal ? 'slideLeft' : 'slideUp'}
                trigger='scroll'
                duration={700}
                delay={textDelay}
                className={`${isHorizontal ? '' : 'flex-1'}`}>
                <p
                  {...(documentId && documentType
                    ? createSanityDataAttribute(documentId, documentType, `${itemPath}.description`)
                    : {})}
                  className='text-body-2xl md:text-body-3xl font-bold md:font-bold text-center'>
                  {item.description}
                </p>
              </AnimateIn>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconList;
