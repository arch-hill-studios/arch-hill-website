import React from 'react';
import { stegaClean } from 'next-sanity';
import CTA from './UI/CTA';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { closingCardSpacing, sitePaddingX } from '@/utils/spacingConstants';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import type { InternalLinkType } from '@/types/shared';

interface ClosingCtaProps {
  title?: string;
  message?: string;
  ctaText?: string;
  linkType?: 'internal' | 'external';
  internalLink?: InternalLinkType;
  externalUrl?: string;
  openInNewTab?: boolean;
  computedHref?: string;
  pageSectionId?: string;
  documentId?: string;
  documentType?: string;
  basePath?: string;
}

const ClosingCta = ({
  title,
  message,
  ctaText,
  linkType,
  internalLink,
  externalUrl,
  openInNewTab = false,
  computedHref,
  pageSectionId,
  documentId,
  documentType,
  basePath,
}: ClosingCtaProps) => {
  const cleanTitle = stegaClean(title);
  const cleanMessage = stegaClean(message);
  const cleanCtaText = stegaClean(ctaText);
  const cleanExternalUrl = stegaClean(externalUrl);

  // Don't render if missing required fields
  if (!cleanTitle || !cleanMessage || !cleanCtaText) {
    return null;
  }

  // Build href using same logic as Card component
  let href = '';

  if (computedHref) {
    href = stegaClean(computedHref);
  } else if (linkType === 'internal') {
    if (
      internalLink &&
      typeof internalLink === 'object' &&
      'href' in internalLink &&
      internalLink.href
    ) {
      href = internalLink.href;
      if (pageSectionId) {
        href = `${href}#${stegaClean(pageSectionId)}`;
      }
    } else {
      href = '/';
    }
  } else if (linkType === 'external' && cleanExternalUrl) {
    href = cleanExternalUrl;
  }

  // Don't render if no valid href
  if (!href) {
    return null;
  }

  const shouldOpenInNewTab = linkType === 'external' || (linkType === 'internal' && openInNewTab);

  return (
    <section
      className={`${closingCardSpacing} ${sitePaddingX} mx-auto text-center`}
      {...createSanityDataAttribute(documentId, documentType, basePath)}>
      <h2
        className='font-heading text-body-5xl uppercase tracking-[4px] text-brand-white mb-4'
        {...createSanityDataAttribute(
          documentId,
          documentType,
          basePath ? `${basePath}.title` : undefined,
        )}>
        {title}
      </h2>
      <p
        className='text-brand-muted max-w-150 mx-auto mb-8 text-body-base leading-relaxed'
        {...createSanityDataAttribute(
          documentId,
          documentType,
          basePath ? `${basePath}.message` : undefined,
        )}>
        {message}
      </p>
      <CTA
        href={href}
        variant='filled'
        target={shouldOpenInNewTab ? '_blank' : undefined}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}>
        <span
          {...createSanityDataAttribute(
            documentId,
            documentType,
            basePath ? `${basePath}.ctaText` : undefined,
          )}>
          {ctaText}
        </span>
        {shouldOpenInNewTab && <FaExternalLinkAlt className='ml-4' />}
      </CTA>
    </section>
  );
};

export default ClosingCta;
