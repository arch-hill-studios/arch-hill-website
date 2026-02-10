import React from 'react';
import { stegaClean } from 'next-sanity';
import type { HOME_PAGE_HERO_QUERY_RESULT } from '@/sanity/types';
import type { BrandTextImage } from './Hero';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import { parseColoredText } from '@/utils/textHelpers';
import UnifiedImage from '@/components/UI/UnifiedImage';

interface HeroTitleProps {
  h1Title: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['h1Title'];
  mainTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['mainTitle'];
  subTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['subTitle'];
  brandTextImage?: BrandTextImage;
  documentId: string;
  documentType: string;
  textAlignment?: string;
  isDefault?: boolean;
}

const HeroTitle = ({
  h1Title,
  mainTitle,
  subTitle,
  brandTextImage,
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

  const hasBrandTextImage = brandTextImage?.asset;

  return (
    <>
      {/* SEO and Screen Reader H1 - Hidden from visual UI */}
      {h1Title && <h1 className='sr-only'>{stegaClean(h1Title)}</h1>}

      {/* Visual Hero Title Container */}
      <div
        className={`w-full ${getContainerAlignmentClass(textAlignment)} ${getTextAlignmentClass(textAlignment)}`}>
        {/* Brand Text Image - displayed if available from Business & Contact Info */}
        {hasBrandTextImage && (
          <div className='mb-6'>
            <UnifiedImage
              src={brandTextImage}
              alt={brandTextImage?.alt || 'Brand logo'}
              mode='sized'
              width={900}
              height={200}
              sizeContext='hero'
              objectFit='contain'
              className='w-full h-auto mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]'
            />
          </div>
        )}

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
            className='font-light uppercase tracking-[3px] text-body-sm xxs:text-body-lg [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]'
            {...createSanityDataAttribute(documentId, documentType, 'subTitle')}>
            {parseColoredText(stegaClean(subTitle), 'white-orange')}
          </p>
        )}
      </div>
    </>
  );
};

export default HeroTitle;
