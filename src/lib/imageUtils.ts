import type { SanityImageSource } from '@sanity/image-url';

/**
 * Utility functions for image handling and optimization
 */

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ImageObjectData {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
}

export interface ImageValidationResult {
  isValid: boolean;
  isSanityImage: boolean;
  isStringUrl: boolean;
  hasAsset: boolean;
}

/**
 * Validates if an image source is usable
 */
export function validateImageSource(src: unknown): ImageValidationResult {
  if (!src) {
    return {
      isValid: false,
      isSanityImage: false,
      isStringUrl: false,
      hasAsset: false
    };
  }

  const isStringUrl = typeof src === 'string' && src.length > 0;
  const isSanityImage = typeof src === 'object' && src !== null && 'asset' in src;
  const hasAsset = isSanityImage && (src as { asset?: { _ref: string } }).asset && Boolean((src as { asset?: { _ref: string } }).asset?._ref);

  return {
    isValid: isStringUrl || Boolean(hasAsset),
    isSanityImage,
    isStringUrl,
    hasAsset: Boolean(hasAsset)
  };
}

/**
 * Extracts dimensions from a Sanity image asset reference
 */
export function extractImageDimensions(src: SanityImageSource): ImageDimensions | null {
  if (!src || typeof src !== 'object' || !('asset' in src)) {
    return null;
  }

  const asset = src.asset as { _ref?: string };
  if (!asset || typeof asset !== 'object' || !('_ref' in asset)) {
    return null;
  }

  const ref = asset._ref;
  if (typeof ref !== 'string') {
    return null;
  }

  // Parse Sanity asset reference to extract dimensions
  // Format: image-{assetId}-{width}x{height}-{format}
  const match = ref.match(/image-[a-f0-9]+-(\d+)x(\d+)-/);
  if (!match) {
    return null;
  }

  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);

  return {
    width,
    height,
    aspectRatio: width / height
  };
}

/**
 * Calculates optimal image dimensions based on display context
 */
export function calculateOptimalDimensions(
  displayWidth: number,
  displayHeight?: number,
  options: {
    dpiMultiplier?: number;
    maxWidth?: number;
    maxHeight?: number;
    maintainAspectRatio?: boolean;
    sourceAspectRatio?: number;
  } = {}
): ImageDimensions {
  const {
    dpiMultiplier = 2,
    maxWidth = 2400,
    maxHeight = 2400,
    maintainAspectRatio = true,
    sourceAspectRatio
  } = options;

  let targetWidth = Math.round(displayWidth * dpiMultiplier);
  let targetHeight = displayHeight ? Math.round(displayHeight * dpiMultiplier) : undefined;

  // Apply maximum constraints
  if (targetWidth > maxWidth) {
    const ratio = maxWidth / targetWidth;
    targetWidth = maxWidth;
    if (targetHeight) {
      targetHeight = Math.round(targetHeight * ratio);
    }
  }

  // If no height specified but we have aspect ratio, calculate it
  if (!targetHeight && sourceAspectRatio && maintainAspectRatio) {
    targetHeight = Math.round(targetWidth / sourceAspectRatio);
  }

  // Apply height constraints
  if (targetHeight && targetHeight > maxHeight) {
    const ratio = maxHeight / targetHeight;
    targetHeight = maxHeight;
    if (maintainAspectRatio) {
      targetWidth = Math.round(targetWidth * ratio);
    }
  }

  const finalHeight = targetHeight || targetWidth;
  return {
    width: targetWidth,
    height: finalHeight,
    aspectRatio: targetWidth / finalHeight
  };
}

/**
 * Generates responsive sizes string for different use cases
 */
export function generateResponsiveSizes(
  context: 'icon' | 'thumbnail' | 'card' | 'hero' | 'gallery' | 'full' | 'custom',
  customSizes?: Array<{ breakpoint: string; size: string }>
): string {
  if (context === 'custom' && customSizes) {
    return customSizes.map(s => `${s.breakpoint} ${s.size}`).join(', ');
  }

  const presets: Record<Exclude<typeof context, 'custom'>, string> = {
    icon: '32px',
    thumbnail: '(max-width: 768px) 64px, 128px',
    card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
    hero: '100vw',
    gallery: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
    full: '100vw'
  };

  return context === 'custom' ? presets.card : presets[context];
}

/**
 * Detects if the current device likely has a high-DPI display
 */
export function detectHighDPI(): number {
  if (typeof window === 'undefined') return 2; // SSR fallback

  // Check device pixel ratio
  const dpr = window.devicePixelRatio || 1;

  if (dpr >= 3) return 3;
  if (dpr >= 2) return 2;
  return 1;
}

/**
 * Filters an array of Sanity images to remove invalid entries
 */
export function filterValidImages<T extends { image?: SanityImageSource }>(
  images: T[]
): Array<T & { image: NonNullable<SanityImageSource> }> {
  return images.filter((item): item is T & { image: NonNullable<SanityImageSource> } => {
    const validation = validateImageSource(item.image);
    return validation.isValid;
  });
}

/**
 * Generates appropriate alt text for images based on context
 */
export function generateAltText(
  image: SanityImageSource,
  context: {
    fallback?: string;
    prefix?: string;
    suffix?: string;
    index?: number;
    total?: number;
  } = {}
): string {
  const { fallback = 'Image', prefix, suffix, index, total } = context;

  // Try to get alt text from image
  let altText = '';
  if (image && typeof image === 'object' && 'alt' in image && image.alt) {
    altText = String(image.alt);
  }

  // Use fallback if no alt text
  if (!altText) {
    altText = fallback;

    // Add index if provided
    if (typeof index === 'number') {
      const indexText = typeof total === 'number' ? `${index + 1} of ${total}` : `${index + 1}`;
      altText = `${altText} ${indexText}`;
    }
  }

  // Add prefix and suffix
  if (prefix) altText = `${prefix} ${altText}`;
  if (suffix) altText = `${altText} ${suffix}`;

  return altText.trim();
}

/**
 * Quality settings for different image contexts
 */
export const IMAGE_QUALITY = {
  thumbnail: 80,
  card: 85,
  hero: 90,
  gallery: 85,
  full: 95,
  icon: 90
} as const;

/**
 * Maximum dimensions for different contexts to prevent over-requesting
 */
export const MAX_DIMENSIONS = {
  icon: { width: 200, height: 200 },
  thumbnail: { width: 400, height: 400 },
  card: { width: 800, height: 800 },
  hero: { width: 2400, height: 1600 },
  gallery: { width: 1200, height: 1200 },
  full: { width: 2400, height: 2400 }
} as const;