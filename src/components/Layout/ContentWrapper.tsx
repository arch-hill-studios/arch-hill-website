'use client';

import React from 'react';
import {
  type SanityLiveEditingProps,
} from '../../utils/sectionHelpers';
import SectionContainer from './SectionContainer';
import type { SanityImageSource } from '@sanity/image-url';
import BackgroundImage, { useBackgroundWrapperProps } from './BackgroundImage';

interface ContentWrapperProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  useCompactGap?: boolean; // Whether to use compact spacing instead of default spacing
  backgroundStyle?: string; // Background style identifier
  backgroundImage?: SanityImageSource; // Background image for 'image' style
}

const ContentWrapper = ({
  children,
  className = '',
  useCompactGap = false,
  backgroundStyle,
  backgroundImage,
}: ContentWrapperProps) => {
  // Get wrapper props (className and style) from background helper
  const wrapperProps = useBackgroundWrapperProps(backgroundStyle, backgroundImage);

  return (
    <div
      className={`${wrapperProps.className} ${className}`.trim()}
      style={wrapperProps.style}
    >
      {/* Background image layer */}
      <BackgroundImage
        backgroundStyle={backgroundStyle}
        backgroundImage={backgroundImage}
      />

      {/* SectionContainer provides internal padding while wrapper element has background */}
      <SectionContainer useCompactPadding={useCompactGap}>
        {children}
      </SectionContainer>
    </div>
  );
};

export default ContentWrapper;
