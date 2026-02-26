import React from 'react';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';

type HeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface GearItem {
  text?: string;
  _type: 'gearItem';
  _key: string;
}

interface GearCategoryProps {
  title?: string;
  items?: GearItem[];
  index: number;
  headingLevel: HeadingLevel;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const GearCategory = ({
  title,
  items,
  index,
  headingLevel,
  documentId,
  documentType,
  fieldPathPrefix = '',
}: GearCategoryProps) => {
  const isRed = index % 2 === 0;
  const validItems = items?.filter((item) => item.text) || [];

  const HeadingTag = headingLevel;

  return (
    <div
      className={`relative overflow-hidden rounded-b-[50px] max-lg:rounded-b-[30px] border-x-[7px] lg:w-180 w-full mx-auto ${
        isRed ? 'border-brand-primary' : 'border-brand-secondary'
      }`}>
      {/* Carpet background overlay */}
      <div
        className='absolute inset-0'
        style={{
          background: `linear-gradient(rgba(10,10,10,0.65), rgba(10,10,10,0.65)), url('/images/carpets/${isRed ? 'carpet-red' : 'carpet-blue'}.jpg') center center / cover no-repeat`,
        }}
      />

      {/* Content */}
      <div className='relative z-10 p-8 lg:p-10 text-left'>
        {/* Category title */}
        {title && (
          <HeadingTag
            className='font-heading text-body-2xl tracking-[3px] uppercase text-brand-white mb-6 pb-5 border-b border-brand-white/20'
            {...(documentId && documentType
              ? createSanityDataAttribute(documentId, documentType, `${fieldPathPrefix}.title`)
              : {})}>
            {title}
          </HeadingTag>
        )}

        {/* Items list */}
        {validItems.length > 0 && (
          <ul className='flex flex-col gap-2.5 w-fit'>
            {validItems.map((item) => (
              <li
                key={item._key}
                className='flex items-start gap-3 text-brand-white text-body-base leading-relaxed'
                {...(documentId && documentType
                  ? createSanityDataAttribute(
                      documentId,
                      documentType,
                      `${fieldPathPrefix}.items[_key=="${item._key}"].text`,
                    )
                  : {})}>
                <span
                  className={`mt-2 shrink-0 w-1.5 h-1.5 rounded-full ${
                    isRed ? 'bg-brand-primary' : 'bg-brand-secondary'
                  }`}
                  aria-hidden='true'
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GearCategory;
