'use client';

import React, { createContext, useContext } from 'react';
import Heading from '../Typography/Heading';
import { stegaClean } from 'next-sanity';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';
import { resolveAlignment } from '../_blocks/shared/alignmentUtils';
import { anchorLinkScrollMarginTop, pageTitleBottomSpacing } from '@/utils/spacingConstants';
import SectionContainer from './SectionContainer';
import { parseColoredText } from '@/utils/textHelpers';
import type { SanityImageSource } from '@sanity/image-url';
import BackgroundImage, { useBackgroundWrapperProps } from './BackgroundImage';

// Context to track if PageSection has a title (affects nested section heading levels)
const PageSectionContext = createContext<{ hasTitle: boolean }>({ hasTitle: false });

interface PageSectionProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  title: string; // Now required since titles are mandatory
  eyebrowTitle?: string; // Optional small text above the title in primary colour
  subtitle?: string;
  topText?: string;
  anchorId?: string; // ID for anchor linking
  inheritAlignment?: 'left' | 'center' | 'right';
  textAlign?: string; // NOTE: This field is currently not set in the CMS, but has been left here for the future in case we want to allow for section level text alignment control in the CMS
  useCompactGap?: boolean; // Whether to use compact spacing instead of default spacing
  eyebrowTitlePath?: string;
  topTextPath?: string;
  hideGraphic?: boolean;
  backgroundStyle?: string; // Background style identifier
  backgroundImage?: SanityImageSource; // Background image for 'image' style
  twoColumnLayout?: boolean; // Whether to enable two-column layout
  rightColumn?: React.ReactNode; // Content for the right column when two-column layout is enabled
}

const PageSection = ({
  children,
  className = '',
  title,
  eyebrowTitle,
  subtitle,
  topText,
  anchorId,
  documentId,
  documentType,
  titlePath,
  subtitlePath,
  eyebrowTitlePath,
  topTextPath,
  inheritAlignment,
  textAlign = 'inherit',
  useCompactGap = false,
  backgroundStyle,
  backgroundImage,
  twoColumnLayout = false,
  rightColumn,
}: PageSectionProps) => {
  // Create data attributes for Sanity live editing
  const titleDataAttribute = createSanityDataAttribute(documentId, documentType, titlePath);
  const subtitleDataAttribute = createSanityDataAttribute(documentId, documentType, subtitlePath);
  const eyebrowTitleDataAttribute = createSanityDataAttribute(
    documentId,
    documentType,
    eyebrowTitlePath,
  );
  const topTextDataAttribute = createSanityDataAttribute(documentId, documentType, topTextPath);

  // Resolve alignment using shared utility (same as other components)
  const cleanTextAlign = stegaClean(textAlign) || 'inherit';
  const resolved = resolveAlignment(cleanTextAlign, inheritAlignment);

  const hasTitle = Boolean(title);

  // Get wrapper props (className and style) from background helper
  const wrapperProps = useBackgroundWrapperProps(backgroundStyle, backgroundImage);

  // Determine if we should use left alignment on mobile based on PageBuilder alignment
  const isLeftAligned = resolved === 'left';

  // Standard single-column title wrapper: centered layout
  const singleColumnTitleClasses = `text-center ${pageTitleBottomSpacing}`;

  // Two-column title wrapper: keeps existing left-aligned styling with vertical line
  const twoColumnTitleClasses = isLeftAligned
    ? `relative pb-4 md:pb-8 pl-4 text-left
       before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[0.5] before:bg-brand-primary ${pageTitleBottomSpacing}`
    : `relative pb-4 md:pb-8 text-center
       md:pl-4 md:text-left
       after:content-[""] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-1/2 after:h-[0.5] after:bg-brand-primary
       md:after:hidden
       md:before:content-[""] md:before:absolute md:before:left-0 md:before:top-0 md:before:bottom-0 md:before:w-[0.5] md:before:bg-brand-primary ${pageTitleBottomSpacing}`;

  return (
    <PageSectionContext.Provider value={{ hasTitle }}>
      <section
        id={anchorId ? stegaClean(anchorId) : undefined}
        className={`${wrapperProps.className} ${className} ${anchorLinkScrollMarginTop}`.trim()}
        style={wrapperProps.style}>
        {/* Background image layer */}
        <BackgroundImage backgroundStyle={backgroundStyle} backgroundImage={backgroundImage} />

        {/* SectionContainer provides internal padding while section element has background */}
        <SectionContainer useCompactPadding={useCompactGap}>
          {twoColumnLayout ? (
            /* Two-Column Layout Mode */
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-18'>
              {/* Left Column */}
              <div>
                {/* Title, topText, and subtitle in left column */}
                <div className={twoColumnTitleClasses}>
                  {eyebrowTitle && (
                    <div className='flex items-center justify-start gap-5 mb-2.5'>
                      <span className='w-15 h-px bg-brand-primary' />
                      <span
                        className='font-heading text-body-sm tracking-[4px] uppercase text-brand-primary'
                        {...eyebrowTitleDataAttribute}>
                        {stegaClean(eyebrowTitle)}
                      </span>
                      <span className='w-15 h-px bg-brand-primary' />
                    </div>
                  )}
                  <div className='inline-flex items-end gap-4 sm:gap-8'>
                    <div className='text-left'>
                      <Heading
                        level='h2'
                        showMargin={false}
                        className='mb-0 uppercase'
                        style={{ letterSpacing: '0.25rem' }}
                        {...titleDataAttribute}>
                        {parseColoredText(stegaClean(title))}
                      </Heading>
                    </div>
                  </div>
                  {topText && (
                    <p
                      className='text-body-sm text-brand-secondary font-bold max-w-4xl whitespace-pre-line'
                      {...topTextDataAttribute}>
                      {stegaClean(topText)}
                    </p>
                  )}
                  {subtitle && (
                    <p
                      className='text-body-base text-brand-white/60 max-w-4xl whitespace-pre-line mt-4'
                      style={{ lineHeight: '1.8' }}
                      {...subtitleDataAttribute}>
                      {subtitle}
                    </p>
                  )}
                </div>
                {/* Left column content (children) */}
                {children}
              </div>

              {/* Right Column */}
              <div>{rightColumn}</div>
            </div>
          ) : (
            /* Standard Single-Column Layout */
            <>
              <div className={singleColumnTitleClasses}>
                {/* Eyebrow title with decorative lines */}
                {eyebrowTitle && (
                  <div className='flex items-center justify-center gap-5 mb-2.5'>
                    <span className='w-15 h-px bg-brand-primary' />
                    <span
                      className='font-heading text-body-sm tracking-[4px] uppercase text-brand-primary'
                      {...eyebrowTitleDataAttribute}>
                      {stegaClean(eyebrowTitle)}
                    </span>
                    <span className='w-15 h-px bg-brand-primary' />
                  </div>
                )}
                {/* Section title */}
                <Heading
                  level='h2'
                  showMargin={false}
                  className='mb-0 uppercase'
                  style={{ letterSpacing: '0.25rem' }}
                  {...titleDataAttribute}>
                  {parseColoredText(stegaClean(title))}
                </Heading>
                {topText && (
                  <p
                    className='text-body-sm text-brand-secondary font-bold max-w-4xl mx-auto whitespace-pre-line mt-2'
                    {...topTextDataAttribute}>
                    {stegaClean(topText)}
                  </p>
                )}
                {/* Section subtitle */}
                {subtitle && (
                  <p
                    className='text-body-base text-brand-white/60 max-w-150 mx-auto whitespace-pre-line mt-4'
                    style={{ lineHeight: '1.8' }}
                    {...subtitleDataAttribute}>
                    {subtitle}
                  </p>
                )}
              </div>
              {children}
            </>
          )}
        </SectionContainer>
      </section>
    </PageSectionContext.Provider>
  );
};

// Hook to access PageSection context
export const usePageSectionContext = () => useContext(PageSectionContext);

export default PageSection;
