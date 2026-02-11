'use client';

import React, { useState, useEffect } from 'react';
import HeroImages from './HeroImages';
import HeroVideo from './HeroVideo';
import DefaultHeroLayout from './DefaultHeroLayout';
import BackgroundHeroLayout from './BackgroundHeroLayout';
import ScrollIndicator from './ScrollIndicator';
import type { HOME_PAGE_HERO_QUERY_RESULT } from '@/sanity/types';
import { getBrandTextImage } from '@/lib/organizationInfo';
import { urlFor } from '@/sanity/lib/image';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';
import { stegaClean } from 'next-sanity';
import { useHeader } from '@/contexts/HeaderContext';
import { headerHeight } from '@/utils/spacingConstants';

export type BrandTextImage = ReturnType<typeof getBrandTextImage>;

interface HeroProps {
  heroStyle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroStyle'];
  heroImages: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroImages'];
  heroVideo: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroVideo'];
  heroImageTransitionDuration: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroImageTransitionDuration'];
  h1Title: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['h1Title'];
  mainTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['mainTitle'];
  subTitle: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['subTitle'];
  heroCallToActionList: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroCallToActionList'];
  hideScrollIndicator: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['hideScrollIndicator'];
  heroDefaultContentPosition: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroDefaultContentPosition'];
  heroContentPosition: NonNullable<HOME_PAGE_HERO_QUERY_RESULT>['heroContentPosition'];
  brandTextImage?: BrandTextImage;
  documentId: string;
  documentType: string;
}

const Hero = ({
  heroStyle,
  heroImages,
  heroVideo,
  heroImageTransitionDuration,
  h1Title,
  mainTitle,
  subTitle,
  heroCallToActionList,
  hideScrollIndicator,
  heroDefaultContentPosition,
  heroContentPosition,
  brandTextImage,
  documentId,
  documentType,
}: HeroProps) => {
  const { setEnableOpacityFade } = useHeader();
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [shouldUseGradientTransition, setShouldUseGradientTransition] = useState(true);

  // Enable header opacity fade when Hero is mounted
  useEffect(() => {
    setEnableOpacityFade(true);

    // Disable it when component unmounts
    return () => {
      setEnableOpacityFade(false);
    };
  }, [setEnableOpacityFade]);

  const handleFirstImageLoaded = () => {
    setFirstImageLoaded(true);
    // Always use gradient transition since we're always fading in
    setShouldUseGradientTransition(true);
  };

  // Convert Sanity image array to HeroImages component format and filter valid images
  const validImages = heroImages?.filter((image) => image && image.asset && image.asset._ref) || [];

  // Request 2x size for high-DPI displays (3840x2160 for crisp 4K rendering)
  const images = validImages.map((image, index) => ({
    imageUrl: urlFor(image).width(3840).height(2160).quality(90).url(),
    altText: image.alt || `Hero image ${index + 1}`,
  }));

  // Get video URL from Sanity
  // File reference format: file-{assetId}-{extension}
  // Example: file-2c140904a9fb2c5a7992ebdaab60ee9701d53e2f-mov
  const videoUrl = heroVideo?.asset?._ref
    ? (() => {
        const ref = heroVideo.asset._ref;
        // Remove 'file-' prefix and get the rest
        const withoutPrefix = ref.replace('file-', '');
        // Split by last dash to separate asset ID from extension
        const lastDashIndex = withoutPrefix.lastIndexOf('-');
        const assetId = withoutPrefix.substring(0, lastDashIndex);
        const extension = withoutPrefix.substring(lastDashIndex + 1);
        // Construct URL with proper extension
        return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${assetId}.${extension}`;
      })()
    : null;

  // Determine hero style - use override if active, otherwise use CMS value
  // Default to 'default' if not provided, clean any stega characters
  const currentHeroStyle = stegaClean(heroStyle) || 'default';

  // For Default style, allow height to exceed viewport on mobile only
  // For background-images and video, always constrain to viewport height
  // Use svh (small viewport height) to account for mobile browser toolbars
  const heightClass =
    currentHeroStyle === 'default' ? 'min-h-svh md:h-svh md:min-h-[600px]' : 'h-svh min-h-[600px]';

  // Hide scroll indicator for Default style on mobile
  const shouldShowScrollIndicator =
    !stegaClean(hideScrollIndicator) &&
    !(currentHeroStyle === 'default' && typeof window !== 'undefined' && window.innerWidth < 768);

  return (
    <section
      id='home'
      data-hero
      className={`relative ${heightClass} flex flex-col ${
        currentHeroStyle === 'background-images' || currentHeroStyle === 'video' ? 'bg-black' : ''
      }`}>
      {/* Z-index hierarchy: Background (z-10) → Gradient (z-20) → Content (z-[25]) → Header (z-30) → Mobile menu (z-40) */}
      <div className={`w-full ${headerHeight}`}></div>

      {/* Hero Style Click-to-Edit Wrapper */}
      <div
        {...createSanityDataAttribute(documentId, documentType, 'heroStyle')}
        className='absolute inset-0 pointer-events-none z-0'
      />

      {/* Background Images Hero Style */}
      {currentHeroStyle === 'background-images' && (
        <>
          {images.length > 0 && (
            <HeroImages
              images={images}
              duration={(heroImageTransitionDuration || 4) * 1000}
              onFirstImageLoaded={handleFirstImageLoaded}
            />
          )}
          <div
            className={`absolute inset-0 bg-black/50 z-20 ${
              shouldUseGradientTransition ? 'transition-opacity duration-1000 ease-in-out' : ''
            } ${firstImageLoaded || images.length === 0 ? 'opacity-90' : 'opacity-0'}`}
          />
        </>
      )}

      {/* Video Hero Style */}
      {currentHeroStyle === 'video' && (
        <>
          {videoUrl && <HeroVideo videoUrl={videoUrl} onVideoLoaded={handleFirstImageLoaded} />}
          <div className={`absolute inset-0 bg-black/50 z-20`} />
        </>
      )}

      {/* Default Hero Style - Dark Radial Gradient Background */}
      {currentHeroStyle === 'default' && (
        <>
          <div
            className='absolute inset-0 z-10'
            style={{ backgroundColor: 'var(--color-brand-dark)' }}
          />
          <div className='shrink-0 h-16 md:h-24 lg:h-32' />
        </>
      )}

      {/* Main content area - grows to fill available space */}
      {/* flex-col always applied - needed for default style to distribute space, and for regular layout positioning */}
      <div className='flex-1 flex flex-col relative z-25'>
        {currentHeroStyle === 'default' ? (
          <DefaultHeroLayout
            h1Title={h1Title}
            mainTitle={mainTitle}
            subTitle={subTitle}
            heroCallToActionList={heroCallToActionList}
            heroContentPosition={heroDefaultContentPosition}
            brandTextImage={brandTextImage}
            images={images}
            imageDuration={(heroImageTransitionDuration || 4) * 1000}
            documentId={documentId}
            documentType={documentType}
          />
        ) : (
          <BackgroundHeroLayout
            h1Title={h1Title}
            mainTitle={mainTitle}
            subTitle={subTitle}
            heroCallToActionList={heroCallToActionList}
            heroContentPosition={heroContentPosition}
            brandTextImage={brandTextImage}
            documentId={documentId}
            documentType={documentType}
          />
        )}
      </div>

      {/* Bottom padding with scroll indicator */}
      {shouldShowScrollIndicator && (
        <div className='shrink-0 flex flex-col items-center justify-end h-24 relative z-30 mb-4'>
          <div className='block'>
            <ScrollIndicator />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
