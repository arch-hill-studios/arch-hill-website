import React from 'react';
import { stegaClean } from 'next-sanity';
import type { HOME_PAGE_HERO_QUERY_RESULT } from '@/sanity/types';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import { parseColoredText } from '@/utils/textHelpers';

interface HeroTitleProps {
  h1Title: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['h1Title'];
  mainTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['mainTitle'];
  subTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['subTitle'];
  documentId: string;
  documentType: string;
  textAlignment?: string;
  isDefault?: boolean;
}

const HeroTitle = ({
  h1Title,
  mainTitle,
  subTitle,
  documentId,
  documentType,
  textAlignment = 'center',
  isDefault = false,
}: HeroTitleProps) => {
  // Get responsive text alignment class based on the alignment prop
  const getTextAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'text-center md:text-left'; // center on mobile, left on desktop
      case 'right':
        return 'text-center md:text-right'; // center on mobile, right on desktop
      case 'center':
      default:
        return 'text-center';
    }
  };

  // Get container alignment class based on the alignment prop
  const getContainerAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'mx-auto md:mx-0 md:mr-auto'; // center on mobile, left on desktop
      case 'right':
        return 'mx-auto md:mx-0 md:ml-auto'; // center on mobile, right on desktop
      case 'center':
      default:
        return 'mx-auto';
    }
  };

  return (
    <>
      {/* SEO and Screen Reader H1 - Hidden from visual UI */}
      {h1Title && <h1 className='sr-only'>{stegaClean(h1Title)}</h1>}

      {/* Visual Hero Title Container */}
      <div
        className={`w-full ${isDefault ? '' : 'md:w-[33vw]'} ${getContainerAlignmentClass(textAlignment)} ${getTextAlignmentClass(textAlignment)}`}>
        {/* Main Title */}
        {mainTitle && (
          <p
            className='text-h2 mb-4'
            {...createSanityDataAttribute(documentId, documentType, 'mainTitle')}>
            {parseColoredText(stegaClean(mainTitle), 'orange-white')}
          </p>
        )}

        {/* Sub Title */}
        {subTitle && (
          <p
            className='text-body-2xl'
            {...createSanityDataAttribute(documentId, documentType, 'subTitle')}>
            {parseColoredText(stegaClean(subTitle), 'white-orange')}
          </p>
        )}
      </div>
    </>
  );
};

export default HeroTitle;
