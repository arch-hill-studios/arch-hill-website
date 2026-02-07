'use client';

import React, { useState, useMemo } from 'react';
import NextImage from 'next/image';
import { stegaClean } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImageSource } from '@sanity/image-url';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { generateImageObjectSchema } from '@/lib/structuredData';
import type { ImageObjectData } from '@/lib/imageUtils';
import ImageModal from '../../Modals/ImageModal';
import ImgPlaceHolder from '../ImgPlaceHolder';

// Size context presets for automatic optimization
const SIZE_CONTEXTS = {
  icon: { base: 24, multiplier: 3, maxWidth: 72 },
  thumbnail: { base: 64, multiplier: 2.5, maxWidth: 160 },
  logo: { base: 200, multiplier: 2, maxWidth: 400 },
  profile: { base: 300, multiplier: 2, maxWidth: 600 },
  card: { base: 200, multiplier: 2, maxWidth: 400 },
  hero: { base: 800, multiplier: 2, maxWidth: 1600 },
  gallery: { base: 300, multiplier: 2, maxWidth: 600 },
  full: { base: 1200, multiplier: 1.5, maxWidth: 1800 }
} as const;

interface ResponsiveSizes {
  mobile?: { width: number; height?: number };
  tablet?: { width: number; height?: number };
  desktop?: { width: number; height?: number };
}

interface UnifiedImageProps {
  // Core image data
  src: SanityImageSource | string | null | undefined;
  alt?: string;

  // Layout modes
  mode?: 'fill' | 'sized';

  // When mode='sized'
  width?: number;
  height?: number;

  // When mode='fill'
  aspectRatio?: number | string;

  // Object fit
  objectFit?: 'cover' | 'contain';

  // Auto-sizing configuration
  displaySize?: {
    width: number;
    height?: number;
  };
  dpiMultiplier?: 1 | 2 | 3 | 'auto';

  // Context-based auto-sizing
  sizeContext?: keyof typeof SIZE_CONTEXTS;

  // Responsive sizing
  responsiveSizes?: ResponsiveSizes;

  // Sanity optimization
  sanityWidth?: number;
  sanityHeight?: number;
  quality?: number;

  // Next.js Image props
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';

  // SEO & Schema
  generateSchema?: boolean;
  schemaContext?: 'blog' | 'article' | 'gallery' | 'profile';

  // Styling
  className?: string;
  rounded?: boolean | string;

  // Behavior
  enableModal?: boolean;
  modalCaption?: string;

  // Accessibility
  role?: string;
  'aria-label'?: string;

  // Sanity live editing
  documentId?: string;
  documentType?: string;
  fieldPath?: string;

  // Fallback
  fallback?: React.ReactNode;

  // Additional Next.js Image props
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;

  // Fill mode behavior
  fillContainer?: boolean;
}

const UnifiedImage: React.FC<UnifiedImageProps> = ({
  src,
  alt,
  mode = 'fill',
  width,
  height,
  aspectRatio: _aspectRatio, // eslint-disable-line @typescript-eslint/no-unused-vars
  objectFit = 'cover',
  displaySize,
  dpiMultiplier = 'auto',
  sizeContext,
  responsiveSizes,
  sanityWidth,
  sanityHeight,
  quality = 90,
  sizes,
  priority = false,
  loading,
  generateSchema = false,
  schemaContext,
  className = '',
  rounded,
  enableModal = false,
  modalCaption,
  role,
  'aria-label': ariaLabel,
  documentId,
  documentType,
  fieldPath,
  fallback,
  style,
  onLoad,
  onError,
  fillContainer = true,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Clean Sanity data
  const cleanSrc = stegaClean(src);
  const cleanAlt = stegaClean(alt);

  // Determine if we have a valid image
  const isSanityImage = cleanSrc && typeof cleanSrc === 'object' && 'asset' in cleanSrc;
  const isStringUrl = typeof cleanSrc === 'string' && cleanSrc.length > 0;
  const hasValidImage = (isSanityImage && cleanSrc.asset) || isStringUrl;

  // Calculate optimal Sanity image dimensions
  const optimalDimensions = useMemo(() => {
    if (!isSanityImage) return null;

    let targetWidth: number;
    let targetHeight: number | undefined;

    // Use explicit Sanity dimensions if provided
    if (sanityWidth) {
      targetWidth = sanityWidth;
      targetHeight = sanityHeight;
    }
    // Use display size if provided
    else if (displaySize) {
      const multiplier = dpiMultiplier === 'auto' ? 2 : dpiMultiplier;
      targetWidth = displaySize.width * multiplier;
      targetHeight = displaySize.height ? displaySize.height * multiplier : undefined;
    }
    // Use size context preset
    else if (sizeContext && SIZE_CONTEXTS[sizeContext]) {
      const context = SIZE_CONTEXTS[sizeContext];
      targetWidth = Math.min(context.base * context.multiplier, context.maxWidth);
    }
    // Use component width/height if in sized mode
    else if (mode === 'sized' && width) {
      const multiplier = dpiMultiplier === 'auto' ? 2 : dpiMultiplier;
      targetWidth = width * multiplier;
      targetHeight = height ? height * multiplier : undefined;
    }
    // Default fallback based on mode
    else {
      const multiplier = dpiMultiplier === 'auto' ? 2 : dpiMultiplier;
      if (mode === 'fill') {
        targetWidth = 800 * multiplier; // Good default for fill images
      } else {
        targetWidth = 400 * multiplier; // Good default for sized images
      }
    }

    return {
      width: Math.round(targetWidth),
      height: targetHeight ? Math.round(targetHeight) : undefined
    };
  }, [isSanityImage, sanityWidth, sanityHeight, displaySize, dpiMultiplier, sizeContext, mode, width, height]);

  // Generate image URL
  const imageUrl = useMemo(() => {
    if (!hasValidImage) return null;

    if (isStringUrl) {
      return cleanSrc as string;
    }

    if (isSanityImage && optimalDimensions) {
      let builder = urlFor(cleanSrc).width(optimalDimensions.width);

      if (optimalDimensions.height) {
        builder = builder.height(optimalDimensions.height);
      }

      return builder.quality(quality).auto('format').url();
    }

    return null;
  }, [hasValidImage, isStringUrl, isSanityImage, cleanSrc, optimalDimensions, quality]);

  // Generate blur data URL for placeholder
  const blurDataURL = useMemo(() => {
    if (!isSanityImage || !hasValidImage) return undefined;

    // Check if Sanity image has LQIP (Low Quality Image Placeholder) metadata
    if (
      typeof cleanSrc === 'object' &&
      cleanSrc &&
      'asset' in cleanSrc &&
      cleanSrc.asset &&
      typeof cleanSrc.asset === 'object' &&
      'metadata' in cleanSrc.asset &&
      cleanSrc.asset.metadata &&
      typeof cleanSrc.asset.metadata === 'object' &&
      'lqip' in cleanSrc.asset.metadata &&
      typeof cleanSrc.asset.metadata.lqip === 'string'
    ) {
      return cleanSrc.asset.metadata.lqip;
    }

    // Otherwise, generate a blurred version using Sanity URL builder
    try {
      return urlFor(cleanSrc)
        .width(20)
        .blur(50)
        .quality(30)
        .auto('format')
        .url();
    } catch {
      return undefined;
    }
  }, [isSanityImage, hasValidImage, cleanSrc]);

  // Generate alt text
  const imageAlt = useMemo(() => {
    if (cleanAlt) return cleanAlt;

    // Try to extract alt from Sanity image
    if (isSanityImage && typeof cleanSrc === 'object' && 'alt' in cleanSrc && cleanSrc.alt) {
      return stegaClean(cleanSrc.alt);
    }

    // Contextual fallbacks
    if (schemaContext === 'blog') return 'Blog post image';
    if (schemaContext === 'gallery') return 'Gallery image';
    if (schemaContext === 'profile') return 'Profile image';

    return 'Image';
  }, [cleanAlt, isSanityImage, cleanSrc, schemaContext]);

  // Generate responsive sizes if not provided
  const responsiveSizesString = useMemo(() => {
    if (sizes) return sizes;

    if (responsiveSizes) {
      const sizeArray = [];
      if (responsiveSizes.mobile) {
        sizeArray.push(`(max-width: 768px) ${responsiveSizes.mobile.width}px`);
      }
      if (responsiveSizes.tablet) {
        sizeArray.push(`(max-width: 1024px) ${responsiveSizes.tablet.width}px`);
      }
      if (responsiveSizes.desktop) {
        sizeArray.push(`${responsiveSizes.desktop.width}px`);
      }
      return sizeArray.join(', ');
    }

    // Default responsive sizes based on context
    if (sizeContext) {
      const defaults = {
        icon: '32px',
        thumbnail: '(max-width: 768px) 64px, 128px',
        logo: '(max-width: 768px) 160px, 200px',
        profile: '(max-width: 768px) 150px, 300px',
        card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
        hero: '100vw',
        gallery: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
        full: '100vw'
      };
      return defaults[sizeContext];
    }

    // Fallback based on mode
    return mode === 'fill'
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      : '200px';
  }, [sizes, responsiveSizes, sizeContext, mode]);

  // Generate rounded classes
  const roundedClasses = useMemo(() => {
    if (!rounded) return '';
    if (typeof rounded === 'string') return rounded;
    return 'rounded-lg';
  }, [rounded]);

  // Generate schema markup if requested
  const schemaMarkup = useMemo(() => {
    if (!generateSchema || !hasValidImage || !imageUrl) return null;

    const schemaData: ImageObjectData = {
      url: imageUrl,
      alt: imageAlt,
      ...(optimalDimensions?.width && { width: optimalDimensions.width }),
      ...(optimalDimensions?.height && { height: optimalDimensions.height }),
      ...(modalCaption && { caption: modalCaption })
    };

    return generateImageObjectSchema(schemaData);
  }, [generateSchema, hasValidImage, imageUrl, imageAlt, optimalDimensions, modalCaption]);

  // Sanity live editing attributes
  const sanityDataAttribute = fieldPath
    ? createSanityDataAttribute(documentId, documentType, fieldPath)
    : {};

  // Handle image load
  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  // Handle modal
  const handleOpenModal = () => {
    if (enableModal && imageUrl) {
      setIsModalOpen(true);
    }
  };

  // Render fallback if no valid image
  if (!hasValidImage || !imageUrl) {
    return fallback || <ImgPlaceHolder />;
  }

  // Common image props
  const imageProps = {
    src: imageUrl,
    alt: imageAlt,
    className: `${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${roundedClasses} transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    sizes: responsiveSizesString || (mode === 'fill' ? '100vw' : undefined),
    priority,
    loading,
    onLoad: handleLoad,
    onError,
    style,
    role,
    'aria-label': ariaLabel,
    ...props
  };

  const ImageComponent = (
    <>
      {/* Schema markup */}
      {schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}

      {/* Image element */}
      <div
        {...sanityDataAttribute}
        className={
          mode === 'fill' && fillContainer
            ? 'relative w-full h-full'
            : mode === 'fill'
            ? 'absolute inset-0'
            : blurDataURL
            ? 'relative flex justify-center'
            : 'flex justify-center'
        }
      >
        {/* Blur background layer - shows immediately */}
        {blurDataURL && (
          <div
            className={`absolute inset-0 ${roundedClasses} ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            style={{
              backgroundImage: `url(${blurDataURL})`,
              backgroundSize: objectFit === 'contain' ? 'contain' : 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            aria-hidden="true"
          />
        )}

        {enableModal ? (
          <button
            onClick={handleOpenModal}
            className={`cursor-pointer border-none bg-transparent p-0 block relative ${
              mode === 'fill' ? 'w-full h-full' : 'w-full'
            }`}
            aria-label={`View full-screen image: ${imageAlt}`}
          >
            {mode === 'fill' ? (
              <NextImage {...imageProps} fill />
            ) : (
              <NextImage
                {...imageProps}
                width={width || optimalDimensions?.width || 400}
                height={height || optimalDimensions?.height || 300}
              />
            )}
          </button>
        ) : (
          mode === 'fill' ? (
            <NextImage {...imageProps} fill />
          ) : (
            <NextImage
              {...imageProps}
              width={width || optimalDimensions?.width || 400}
              height={height || optimalDimensions?.height || 300}
            />
          )
        )}
      </div>

      {/* Modal */}
      {enableModal && (
        <ImageModal
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          caption={modalCaption}
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );

  return ImageComponent;
};

export default UnifiedImage;