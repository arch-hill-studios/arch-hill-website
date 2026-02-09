import React from 'react';
import Icon from '@/lib/iconLibrary';
import type { ItemListBlock } from '@/types/blocks';
import {
  getResponsiveTextAlignClass,
  getResponsiveContainerAlignClass,
} from '@/utils/sectionHelpers';
import { resolveResponsiveAlignment } from './shared/alignmentUtils';
import AnimateIn from '../UI/AnimateIn';

interface ItemListProps extends Omit<ItemListBlock, '_type' | '_key'> {
  className?: string;
  inheritAlignment?: 'left' | 'center' | 'right';
}

const ItemList = ({
  title,
  items = [],
  alignmentMode,
  desktopAlignment,
  mobileAlignment,
  inheritAlignment,
  className = '',
}: ItemListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Resolve responsive alignments
  const { desktop, mobile } = resolveResponsiveAlignment(
    alignmentMode,
    desktopAlignment,
    mobileAlignment,
    undefined, // No legacy textAlign field for ItemList
    inheritAlignment
  );

  // Get responsive classes
  const textAlignClasses = getResponsiveTextAlignClass(mobile, desktop);
  const containerAlignClasses = getResponsiveContainerAlignClass(mobile, desktop);

  // Derive flex justification classes based on alignment
  const getFlexJustifyClass = (align: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  const flexJustifyClasses =
    mobile === desktop
      ? getFlexJustifyClass(mobile)
      : `${getFlexJustifyClass(mobile)} md:${getFlexJustifyClass(desktop)}`;

  return (
    <div className={`space-y-2 ${textAlignClasses} ${containerAlignClasses} ${className}`.trim()}>
      {/* List Title */}
      <p className='font-semibold text-body-xl mb-4'>{title}</p>

      {/* List Items */}
      <ul className='space-y-2'>
        {items.map((item, idx) => (
          <li key={item._key || idx} className={`flex items-center gap-3 ${flexJustifyClasses}`}>
            {/* Dumbbell Icon Bullet */}
            <AnimateIn
              animation='fade'
              trigger='scroll'
              duration={800}
              delay={idx * 100}
              threshold={0.5}>
              <div className='shrink-0 mt-1'>
                <Icon iconKey='dumbell' width={1.5} colorClassName='text-brand-primary' />
              </div>
            </AnimateIn>

            {/* List Item Text */}
            <AnimateIn
              animation='slideLeft'
              trigger='scroll'
              duration={800}
              delay={idx * 100 + 150}
              threshold={0.5}>
              <p className='text-body-lg'>{item.text}</p>
            </AnimateIn>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
