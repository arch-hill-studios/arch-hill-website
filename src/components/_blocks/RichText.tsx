import React from 'react';
import { stegaClean } from 'next-sanity';
import { createComponents } from '@/sanity/portableTextComponents';
import type { RichTextBlock } from '@/types/blocks';
import {
  getResponsiveTextAlignClass,
  getResponsiveContainerAlignClass,
  type TextAlignment,
} from '../../utils/sectionHelpers';
import { resolveResponsiveAlignment } from './shared/alignmentUtils';
import PortableTextWrapper from '@/components/UI/PortableTextWrapper';
import { maxCardWidth } from '@/utils/spacingConstants';

type RichTextProps = RichTextBlock & {
  inheritAlignment?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
};

const RichText = ({
  content,
  alignmentMode,
  desktopAlignment,
  mobileAlignment,
  textAlign, // Legacy field for backwards compatibility
  isCallout = false,
  inheritAlignment,
  fullWidth = false,
}: RichTextProps) => {
  // Clean the values to remove Sanity's stega encoding
  const cleanIsCallout = stegaClean(isCallout) || false;

  if (!content) {
    return null;
  }

  // Resolve responsive alignments
  const { desktop, mobile } = resolveResponsiveAlignment(
    alignmentMode,
    desktopAlignment,
    mobileAlignment,
    textAlign,
    inheritAlignment
  );

  // Create components with desktop alignment context (for portable text styling)
  // The desktop alignment is used as the base for portable text components
  const alignedComponents = createComponents(desktop);

  // Get responsive classes
  const textAlignClasses = getResponsiveTextAlignClass(mobile, desktop);
  const containerAlignClasses = getResponsiveContainerAlignClass(mobile, desktop);

  // Determine if we should apply max-width constraint
  // Only apply max-width for center alignment or when fullWidth is true
  const shouldConstrainWidth = !fullWidth && (desktop === 'center' || mobile === 'center');
  const widthClass = fullWidth ? 'max-w-full' : shouldConstrainWidth ? maxCardWidth : 'max-w-full';

  // Override prose's default mx-auto for left/right alignments
  // The prose class applies mx-auto by default, which needs to be overridden for left/right alignment
  // For left: remove left margin (ml-0) to push content to the left edge
  // For right: remove right margin (mr-0) to push content to the right edge
  const marginOverride = desktop === 'left' ? '!ml-0' : desktop === 'right' ? '!mr-0' : '';

  const proseContent = (
    <PortableTextWrapper
      value={content}
      components={alignedComponents}
      className={`prose prose-slate ${widthClass} ${textAlignClasses} ${containerAlignClasses} ${marginOverride}`}
    />
  );

  // If it's a callout, wrap in Card-style container
  if (cleanIsCallout) {
    return (
      <div
        className={`${widthClass} pb-2 relative text-brand-secondary ${textAlignClasses} ${containerAlignClasses} after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-px after:bg-brand-secondary/50`}>
        {proseContent}
      </div>
    );
  }

  return proseContent;
};

export default RichText;
