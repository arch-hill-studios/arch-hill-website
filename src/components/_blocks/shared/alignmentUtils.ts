import { stegaClean } from 'next-sanity';

export const deriveAlignmentClasses = (alignment: 'left' | 'center' | 'right' | undefined) => {
  switch (alignment) {
    case 'left':
      return 'justify-start';
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    default:
      return '';
  }
};

export const resolveAlignment = (
  alignment: string | undefined,
  inheritAlignment: 'left' | 'center' | 'right' | undefined
): 'left' | 'center' | 'right' | undefined => {
  const cleanAlignment = stegaClean(alignment);
  return cleanAlignment === 'inherit' ? inheritAlignment : cleanAlignment as 'left' | 'center' | 'right' | undefined;
};

export const getAlignmentClasses = (
  alignment: string | undefined,
  inheritAlignment: 'left' | 'center' | 'right' | undefined
) => {
  const resolvedAlignment = resolveAlignment(alignment, inheritAlignment);
  return deriveAlignmentClasses(resolvedAlignment);
};

/**
 * Generates responsive alignment classes for CTA buttons
 * Returns Tailwind classes for responsive justify alignment
 */
export const getResponsiveAlignmentClasses = (
  alignmentMode: string | undefined,
  desktopAlignment: string | undefined,
  mobileAlignment: string | undefined,
  inheritAlignment: 'left' | 'center' | 'right' | undefined
): string => {
  const cleanMode = stegaClean(alignmentMode);
  const cleanDesktop = stegaClean(desktopAlignment);
  const cleanMobile = stegaClean(mobileAlignment);

  // If mode is inherit or not set, use inheritAlignment for both
  if (cleanMode === 'inherit' || !cleanMode) {
    const finalAlignment = inheritAlignment || 'center';
    return deriveAlignmentClasses(finalAlignment);
  }

  // If mode is override, use responsive classes
  const desktop = (cleanDesktop as 'left' | 'center' | 'right') || 'center';
  const mobile = (cleanMobile as 'left' | 'center' | 'right') || 'center';

  // If both alignments are the same, return simple class
  if (desktop === mobile) {
    return deriveAlignmentClasses(desktop);
  }

  // Generate responsive classes
  const mobileClass = deriveAlignmentClasses(mobile);
  const desktopClass = deriveAlignmentClasses(desktop).replace('justify-', 'md:justify-');

  return `${mobileClass} ${desktopClass}`;
};

/**
 * Resolves responsive alignment based on mode
 * Returns both desktop and mobile alignments
 */
export const resolveResponsiveAlignment = (
  alignmentMode: string | undefined,
  desktopAlignment: string | undefined,
  mobileAlignment: string | undefined,
  legacyTextAlign: string | undefined,
  inheritAlignment: 'left' | 'center' | 'right' | undefined
): {
  desktop: 'left' | 'center' | 'right';
  mobile: 'left' | 'center' | 'right';
} => {
  const cleanMode = stegaClean(alignmentMode);
  const cleanDesktop = stegaClean(desktopAlignment);
  const cleanMobile = stegaClean(mobileAlignment);
  const cleanLegacy = stegaClean(legacyTextAlign);

  // Handle legacy textAlign field for backwards compatibility
  if (!cleanMode && cleanLegacy) {
    const resolved = cleanLegacy === 'inherit' ? inheritAlignment : cleanLegacy as 'left' | 'center' | 'right' | undefined;
    const finalAlignment = resolved || 'center';
    return {
      desktop: finalAlignment,
      mobile: finalAlignment,
    };
  }

  // If mode is inherit, use inheritAlignment for both
  if (cleanMode === 'inherit' || !cleanMode) {
    const finalAlignment = inheritAlignment || 'center';
    return {
      desktop: finalAlignment,
      mobile: finalAlignment,
    };
  }

  // If mode is override, use the specified alignments
  return {
    desktop: (cleanDesktop as 'left' | 'center' | 'right') || 'center',
    mobile: (cleanMobile as 'left' | 'center' | 'right') || 'center',
  };
};