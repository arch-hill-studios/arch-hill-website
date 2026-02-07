import React from 'react';
import { stegaClean } from 'next-sanity';
import type { CTAButtonBlock } from '@/types/blocks';
import type { CTABlockProps } from '@/types/shared';
import CTA from '../UI/CTA';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getResponsiveAlignmentClasses } from './shared/alignmentUtils';

type CTAButtonProps = CTABlockProps<CTAButtonBlock>;

const CTAButton = (props: CTAButtonProps & { onClick?: () => void }) => {
  const {
    text,
    variant = 'filled',
    alignmentMode,
    desktopAlignment,
    mobileAlignment,
    inheritAlignment,
    linkType,
    internalLink,
    externalUrl,
    openInNewTab = false,
    computedHref,
    className = '',
    pageSectionId,
    onClick,
  } = props;

  const cleanText = stegaClean(text);
  const cleanExternalUrl = stegaClean(externalUrl);
  const cleanVariant = stegaClean(variant) as 'filled' | 'outline-light' | 'outline-dark' | 'text-link';

  // Don't render if no text or invalid link
  if (!cleanText) {
    return null;
  }

  // Use computed href from GROQ query (already includes section anchors)
  // or fallback to internalLink.href for queries that don't use fullLinkProjection
  let href = '';

  if (computedHref) {
    // Use computedHref (includes anchors) - HomeHero, PageBuilder CTAs
    href = stegaClean(computedHref);
  } else if (linkType === 'internal' && internalLink && 'href' in internalLink && internalLink.href) {
    // Fallback for closing cards and other CTAs without computedHref
    href = internalLink.href;

    // Add section anchor only in fallback mode
    if (pageSectionId) {
      href = `${href}#${stegaClean(pageSectionId)}`;
    }
  } else if (linkType === 'external' && cleanExternalUrl) {
    href = cleanExternalUrl;
  }

  // Don't render if no valid href
  if (!href) {
    return null;
  }

  // Determine if this should open in a new tab
  const shouldOpenInNewTab = linkType === 'external' || (linkType === 'internal' && openInNewTab);

  const alignmentClasses = getResponsiveAlignmentClasses(
    alignmentMode,
    desktopAlignment,
    mobileAlignment,
    inheritAlignment
  );

  // Determine width class - if className contains 'w-full', use that, otherwise use responsive default
  const widthClass = className.includes('w-full') ? 'w-full' : 'w-auto';

  return (
    <div className={`flex ${alignmentClasses} ${className}`.trim()}>
      <CTA
        className={widthClass}
        href={href}
        variant={cleanVariant}
        target={shouldOpenInNewTab ? '_blank' : undefined}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
        onClick={onClick}>
        {cleanText}
        {shouldOpenInNewTab && cleanVariant !== 'text-link' && <FaExternalLinkAlt className='ml-4' />}
      </CTA>
    </div>
  );
};

export default CTAButton;
