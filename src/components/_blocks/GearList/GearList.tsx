import React from 'react';
import type { GearList as GearListType } from '@/sanity/types';
import GearCategory from './GearCategory';
import { sitePaddingX } from '@/utils/spacingConstants';

type HeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface GearListProps extends Omit<GearListType, '_type'> {
  _key?: string;
  headingLevel: HeadingLevel;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const GearList = ({
  categories,
  headingLevel,
  documentId,
  documentType,
  fieldPathPrefix = '',
}: GearListProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className={`mx-auto flex flex-col gap-6 lg:gap-8`}>
      {categories.map((category, index) => (
        <GearCategory
          key={category._key}
          title={category.title}
          items={category.items}
          index={index}
          headingLevel={headingLevel}
          documentId={documentId}
          documentType={documentType}
          fieldPathPrefix={`${fieldPathPrefix}.categories[_key=="${category._key}"]`}
        />
      ))}
    </div>
  );
};

export default GearList;
