import React from 'react';
import { stegaClean } from 'next-sanity';
import type { QuoteBlock } from '@/types/blocks';
import type { BlockProps } from '@/types/shared';
import { resolveAlignment } from './shared/alignmentUtils';
import { getTextAlignClass, type TextAlignment } from '../../utils/sectionHelpers';

interface QuoteProps extends BlockProps<QuoteBlock> {
  className?: string;
  inheritAlignment?: 'left' | 'center' | 'right';
}

const Quote = ({
  text,
  attribution,
  textAlign = 'inherit',
  className = '',
  inheritAlignment,
}: QuoteProps) => {
  // Clean the values to remove Sanity's stega encoding
  const cleanText = stegaClean(text);
  const cleanAttribution = stegaClean(attribution);
  const cleanTextAlign = stegaClean(textAlign) || 'inherit';

  // Resolve alignment using the shared utility (same as CTAButton and RichText)
  const resolved = resolveAlignment(cleanTextAlign, inheritAlignment);
  const effectiveTextAlign = (resolved || 'center') as TextAlignment;

  const getAlignmentClasses = (align: TextAlignment) => {
    switch (align) {
      case 'left':
        return {
          container: 'items-start',
          padding: 'px-6 md:px-8',
        };
      case 'right':
        return {
          container: 'items-end',
          padding: 'px-6 md:px-8',
        };
      default: // center
        return {
          container: 'items-center',
          padding: 'px-6 md:px-8',
        };
    }
  };

  // Don't render if no text is provided
  if (!cleanText) {
    return null;
  }

  const alignmentClasses = getAlignmentClasses(effectiveTextAlign);

  return (
    <div className={`max-w-4xl mx-auto ${className}`.trim()}>
      <blockquote
        className={`
          relative
          ${alignmentClasses.padding}
          py-6 md:py-8
          ${getTextAlignClass(effectiveTextAlign)}
        `.trim()}>
        {/* Opening quotation mark */}
        <div
          className={`
            absolute
            -top-2 md:-top-2
            text-body-8xl md:text-body-9xl
            font-bold
            text-brand-primary/40
            leading-none
            z-0
            ${effectiveTextAlign === 'right' ? 'right-2 md:right-4' : 'left-2 md:left-4'}
          `.trim()}
          aria-hidden='true'>
          &ldquo;
        </div>

        {/* Quote text */}
        <p className='relative z-10 text-body-2xl md:text-body-3xl text-brand-primary font-mediumleading-relaxed italic mb-0'>
          {cleanText}
        </p>

        {/* Closing quotation mark */}
        <div
          className={`
            absolute
            -bottom-4 md:-bottom-6
            right-2 md:right-4
            text-body-8xl md:text-body-9xl
            font-bold
            text-brand-primary/40 
            leading-none
            z-0
          `.trim()}
          aria-hidden='true'>
          &rdquo;
        </div>

        {/* Attribution */}
        {cleanAttribution && (
          <footer className='relative z-10 mt-4 pt-4 border-t border-gray-200'>
            <cite className='text-body-lg font-medium not-italic'>— {cleanAttribution}</cite>
          </footer>
        )}
      </blockquote>
      {/* Underline Border */}
      <div
        className='mt-4 h-[0.5px] w-1/2 mx-auto bg-brand-primary'
        style={{ opacity: 0.2 }}
      />
    </div>
  );
};

export default Quote;
