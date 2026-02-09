import React from 'react';
import type { SanityImageSource } from '@sanity/image-url';
import { urlFor } from '@/sanity/lib/image';

/**
 * Configuration for preset background images
 * Modify this to change the preset naming pattern or supported file types
 */
const PRESET_CONFIG = {
  /** Directory where preset backgrounds are stored */
  directory: '/images/backgrounds',
  /** Prefix for preset background filenames (e.g., "smokey-1", "smokey-2") */
  prefix: 'smokey-',
  /** Supported image file extensions for presets */
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
} as const;

/**
 * Configuration for Sanity image optimization
 */
const SANITY_IMAGE_CONFIG = {
  width: 3840,
  height: 2160,
  quality: 90,
} as const;

/**
 * Gets the background image URL for either custom Sanity images or preset backgrounds
 */
const getBackgroundImageUrl = (
  backgroundStyle?: string,
  backgroundImage?: SanityImageSource
): string | null => {
  // Custom image uploaded by user via Sanity
  if (backgroundStyle === 'image' && backgroundImage) {
    return urlFor(backgroundImage)
      .width(SANITY_IMAGE_CONFIG.width)
      .height(SANITY_IMAGE_CONFIG.height)
      .quality(SANITY_IMAGE_CONFIG.quality)
      .url();
  }

  // Preset backgrounds (e.g., smokey-1, smokey-2, etc.)
  if (backgroundStyle?.startsWith(PRESET_CONFIG.prefix)) {
    const filename = backgroundStyle;

    // Check if filename already has an extension
    const hasExtension = PRESET_CONFIG.supportedExtensions.some(ext =>
      filename.toLowerCase().endsWith(ext)
    );

    if (hasExtension) {
      return `${PRESET_CONFIG.directory}/${filename}`;
    }

    // Default to .jpg if no extension provided (backward compatibility)
    return `${PRESET_CONFIG.directory}/${filename}.jpg`;
  }

  return null;
};

/**
 * Gets the CSS class for background image wrapper
 */
const getBackgroundClass = (backgroundImageUrl: string | null): string => {
  return backgroundImageUrl ? 'background-image-wrapper' : '';
};

/**
 * Gets inline styles for background (non-image backgrounds like gradients)
 */
const getBackgroundStyles = (backgroundStyle?: string): React.CSSProperties => {
  // Radial gradient (no image)
  if (backgroundStyle === 'radial-gradient') {
    return {
      background: 'var(--background-image-brand-gradient-dark-radial)',
    };
  }
  return {};
};

/**
 * Gets the background image layer styles (scales to cover entire section)
 */
const getBackgroundLayerStyles = (backgroundImageUrl: string): React.CSSProperties => {
  return {
    backgroundImage: `url(${backgroundImageUrl})`,
  };
};

/**
 * Convenience function to get all background-related data at once
 */
const getBackgroundConfig = (
  backgroundStyle?: string,
  backgroundImage?: SanityImageSource
) => {
  const imageUrl = getBackgroundImageUrl(backgroundStyle, backgroundImage);

  return {
    imageUrl,
    cssClass: getBackgroundClass(imageUrl),
    styles: getBackgroundStyles(backgroundStyle),
    layerStyles: imageUrl ? getBackgroundLayerStyles(imageUrl) : undefined,
  };
};

// ============================================================================
// Component
// ============================================================================

interface BackgroundImageProps {
  backgroundStyle?: string;
  backgroundImage?: SanityImageSource;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BackgroundImage Component
 *
 * Renders background images that scale to cover the entire section for PageSection and ContentWrapper.
 * Handles both custom Sanity images and preset backgrounds (e.g., smokey-1).
 *
 * @param backgroundStyle - The background style identifier (e.g., "image", "smokey-1", "radial-gradient")
 * @param backgroundImage - Optional Sanity image source for custom backgrounds
 * @param className - Additional CSS classes to apply to the wrapper element
 * @param style - Additional inline styles to apply to the wrapper element
 */
const BackgroundImage = ({
  backgroundStyle,
  backgroundImage,
  className = '',
  style = {},
}: BackgroundImageProps) => {
  const { imageUrl, cssClass, styles, layerStyles } = getBackgroundConfig(
    backgroundStyle,
    backgroundImage
  );

  // If no image URL and no special background style, render nothing
  if (!imageUrl && !styles) {
    return null;
  }

  return (
    <>
      {/* Background image layer that covers the entire section */}
      {imageUrl && layerStyles && (
        <div
          className="background-image-layer"
          style={layerStyles}
        />
      )}
    </>
  );
};

export default BackgroundImage;

/**
 * Hook to get background wrapper props for the parent container
 * Use this to get the className and style for the wrapper element
 */
export const useBackgroundWrapperProps = (
  backgroundStyle?: string,
  backgroundImage?: SanityImageSource
) => {
  const { cssClass, styles } = getBackgroundConfig(backgroundStyle, backgroundImage);

  return {
    className: cssClass,
    style: styles,
  };
};
