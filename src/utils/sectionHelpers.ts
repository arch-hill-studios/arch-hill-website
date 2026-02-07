import { createDataAttribute } from 'next-sanity';

export type TextAlignment = 'left' | 'center' | 'right';
export type TextAlignmentWithInherit = 'inherit' | TextAlignment;

export interface SanityLiveEditingProps {
  documentId?: string;
  documentType?: string;
  titlePath?: string;
  subtitlePath?: string;
}

/**
 * Creates a data attribute object for Sanity live editing
 */
export const createSanityDataAttribute = (
  documentId?: string,
  documentType?: string,
  path?: string
): Record<string, string> => {
  if (!documentId || !documentType || !path) return {};

  try {
    return {
      'data-sanity': createDataAttribute({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
        baseUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '',
        id: documentId,
        type: documentType,
        path: path,
      }).toString(),
    };
  } catch {
    return {};
  }
};

/**
 * Converts text alignment value to corresponding Tailwind CSS class
 */
export const getTextAlignClass = (align: TextAlignment): string => {
  switch (align) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
};

/**
 * Converts text alignment values to responsive Tailwind CSS classes
 * Mobile-first approach: base class is mobile, desktop is with md: prefix
 */
export const getResponsiveTextAlignClass = (
  mobileAlign: TextAlignment,
  desktopAlign: TextAlignment
): string => {
  const mobileClass = getTextAlignClass(mobileAlign);
  const desktopClass = getTextAlignClass(desktopAlign);

  // If they're the same, just return the mobile class
  if (mobileAlign === desktopAlign) {
    return mobileClass;
  }

  // Otherwise, return mobile class with desktop override
  return `${mobileClass} md:${desktopClass}`;
};

/**
 * Gets container positioning classes based on alignment
 */
export const getContainerAlignClass = (align: TextAlignment): string => {
  switch (align) {
    case 'left':
      return 'mr-auto'; // Push container to the left
    case 'right':
      return 'ml-auto'; // Push container to the right
    case 'center':
      return 'mx-auto'; // Center the container
    default:
      return 'mx-auto'; // Default to center
  }
};

/**
 * Gets responsive container positioning classes
 */
export const getResponsiveContainerAlignClass = (
  mobileAlign: TextAlignment,
  desktopAlign: TextAlignment
): string => {
  const mobileClass = getContainerAlignClass(mobileAlign);
  const desktopClass = getContainerAlignClass(desktopAlign);

  // If they're the same, just return the mobile class
  if (mobileAlign === desktopAlign) {
    return mobileClass;
  }

  // Otherwise, return mobile class with desktop override
  // Convert mr-auto to md:mr-auto, ml-auto to md:ml-auto, mx-auto to md:mx-auto
  const desktopResponsive = desktopClass.replace(/^/, 'md:');
  return `${mobileClass} ${desktopResponsive}`;
};

