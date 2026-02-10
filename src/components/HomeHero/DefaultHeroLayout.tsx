import { stegaClean } from 'next-sanity';
import type { HOME_PAGE_HERO_QUERY_RESULT } from '@/sanity/types';
import type { BrandTextImage } from './Hero';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import HeroTitle from './HeroTitle';
import HeroCTA from './HeroCTA';
import HeroImages from './HeroImages';
import AnimateIn from '@/components/UI/AnimateIn';

interface DefaultHeroLayoutProps {
  h1Title: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['h1Title'];
  mainTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['mainTitle'];
  subTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['subTitle'];
  heroCallToActionList: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroCallToActionList'];
  heroContentPosition: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroContentPosition'];
  brandTextImage?: BrandTextImage;
  images: Array<{ imageUrl: string; altText: string }>;
  imageDuration: number;
  documentId: string;
  documentType: string;
  showLogoBackColor?: boolean;
}

// Layout for Default hero style with images on the side
const DefaultHeroLayout = (props: DefaultHeroLayoutProps) => {
  const {
    heroContentPosition,
    h1Title,
    mainTitle,
    subTitle,
    heroCallToActionList,
    brandTextImage,
    images,
    imageDuration,
    documentId,
    documentType,
    showLogoBackColor,
  } = props;

  // Extract position components
  const cleanPosition = stegaClean(
    heroContentPosition?.trim().replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '') ||
      'center-left',
  );
  const [, horizontal] = cleanPosition.split('-');

  // For Default style, only center-left and center-right are valid
  const isContentLeft = horizontal === 'left';

  // Hardcoded to landscape rectangle with 4:3 aspect ratio
  const frameShapeClasses = 'rounded-lg aspect-[4/3]';

  const heroTitleProps = {
    h1Title,
    mainTitle,
    subTitle,
    brandTextImage,
    documentId,
    documentType,
    showLogoBackColor,
    textAlignment: horizontal,
    isDefault: true,
  };

  const heroCTAProps = {
    heroCallToActionList,
    documentId,
    documentType,
  };

  return (
    <>
      {/* Desktop Layout: Side-by-side */}
      <div
        className={`
          hidden md:flex w-full flex-1 items-center justify-center
          px-4 sm:px-8 lg:px-[10%]
          gap-8 lg:gap-12
          mt-6
          min-h-0
        `}
        {...createSanityDataAttribute(documentId, documentType, 'heroContentPosition')}>
        {/* Content column */}
        <AnimateIn
          animation='slideUp'
          trigger='mount'
          duration={1000}
          delay={300}
          className={`flex flex-col gap-4 sm:gap-6 max-w-2xl ${
            isContentLeft ? 'order-1 items-start' : 'order-2 items-end'
          }`}>
          {/* Title */}
          <div className='shrink-0'>
            <HeroTitle {...heroTitleProps} />
          </div>

          {/* CTA buttons */}
          {heroCallToActionList && heroCallToActionList.length > 0 && (
            <div className='shrink-0'>
              <HeroCTA {...heroCTAProps} />
            </div>
          )}
        </AnimateIn>

        {/* Images column - constrained by max-height to fit viewport */}
        <div
          className={`relative w-full max-h-[60vh] overflow-hidden ${frameShapeClasses} ${isContentLeft ? 'order-2' : 'order-1'}`}>
          <HeroImages images={images} duration={imageDuration} />
        </div>
      </div>

      {/* Mobile Layout: Stacked */}
      <div
        className={`
          flex md:hidden w-full flex-col items-center
          px-4 sm:px-8
          gap-6
          py-12
        `}>
        {/* Content */}
        <AnimateIn
          animation='slideUp'
          trigger='mount'
          duration={1000}
          delay={300}
          className='flex flex-col items-center text-center gap-4 sm:gap-6 max-w-2xl w-full'>
          {/* Title */}
          <div className='shrink-0'>
            <HeroTitle {...heroTitleProps} textAlignment='center' />
          </div>

          {/* CTA buttons */}
          {heroCallToActionList && heroCallToActionList.length > 0 && (
            <div className='shrink-0'>
              <HeroCTA {...heroCTAProps} />
            </div>
          )}
        </AnimateIn>

        {/* Images - responsive sizing on mobile */}
        <div className={`relative w-full max-w-2xl overflow-hidden ${frameShapeClasses}`}>
          <HeroImages images={images} duration={imageDuration} />
        </div>
      </div>
    </>
  );
};

export default DefaultHeroLayout;
