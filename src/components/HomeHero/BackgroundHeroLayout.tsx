import { stegaClean } from 'next-sanity';
import type { HOME_PAGE_HERO_QUERY_RESULT } from '@/sanity/types';
import type { BrandTextImage } from './Hero';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import HeroTitle from './HeroTitle';
import HeroCTA from './HeroCTA';
import AnimateIn from '@/components/UI/AnimateIn';

interface VideoImageBackgroundHeroLayoutProps {
  h1Title: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['h1Title'];
  mainTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['mainTitle'];
  subTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['subTitle'];
  heroCallToActionList: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroCallToActionList'];
  heroContentPosition: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroContentPosition'];
  brandTextImage?: BrandTextImage;
  documentId: string;
  documentType: string;
  showLogoBackColor?: boolean;
}

// Regular flexbox layout: content positioning with flexbox
const VideoImageBackgroundHeroLayout = (props: VideoImageBackgroundHeroLayoutProps) => {
  const {
    heroContentPosition,
    h1Title,
    mainTitle,
    subTitle,
    heroCallToActionList,
    brandTextImage,
    documentId,
    documentType,
    showLogoBackColor,
  } = props;

  // Extract position components
  const cleanPosition = stegaClean(
    heroContentPosition?.trim().replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '') ||
      'center-center',
  );
  const [vertical, horizontal] = cleanPosition.split('-');

  // Map vertical position to justify-content classes
  const getVerticalAlignment = (vert: string) => {
    switch (vert) {
      case 'top':
        return 'justify-start';
      case 'bottom':
        return 'justify-end';
      case 'center':
      default:
        return 'justify-center';
    }
  };

  // Map horizontal position to items and text alignment classes with mobile responsiveness
  const getHorizontalAlignment = (horiz: string) => {
    switch (horiz) {
      case 'left':
        return {
          items: 'items-center md:items-start', // center on mobile, left on desktop
          text: 'text-center md:text-left',
          content: 'items-center md:items-start',
        };
      case 'right':
        return {
          items: 'items-center md:items-end', // center on mobile, right on desktop
          text: 'text-center md:text-right',
          content: 'items-center md:items-end',
        };
      case 'center':
      default:
        return {
          items: 'items-center',
          text: 'text-center',
          content: 'items-center',
        };
    }
  };

  const verticalClasses = getVerticalAlignment(vertical);
  const horizontalConfig = getHorizontalAlignment(horizontal);

  const componentProps = {
    h1Title,
    mainTitle,
    subTitle,
    heroCallToActionList,
    brandTextImage,
    documentId,
    documentType,
    showLogoBackColor,
    textAlignment: horizontal,
  };

  return (
    <div
      className={`
        w-full flex-1 flex flex-col ${verticalClasses} ${horizontalConfig.items}
        px-4 sm:px-8 lg:px-[10%]
      `}
      {...createSanityDataAttribute(documentId, documentType, 'heroContentPosition')}>
      {/* Content container with responsive alignment */}
      <AnimateIn
        animation='slideUp'
        trigger='mount'
        duration={1000}
        delay={300}
        className={`flex flex-col ${horizontalConfig.content} ${horizontalConfig.text} gap-10 max-w-4xl w-full mt-6`}>
        {/* Title - priority content */}
        <div className='shrink-0 w-full'>
          <HeroTitle {...componentProps} />
        </div>

        {/* CTA buttons - always visible, aligned with content */}
        {heroCallToActionList && heroCallToActionList.length > 0 && (
          <div className='shrink-0'>
            <HeroCTA {...componentProps} />
          </div>
        )}
      </AnimateIn>
    </div>
  );
};

export default VideoImageBackgroundHeroLayout;
