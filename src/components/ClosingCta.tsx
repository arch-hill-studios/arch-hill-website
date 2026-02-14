import React from 'react';
import { stegaClean } from 'next-sanity';
import CTA from './UI/CTA';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { closingCardSpacing } from '@/utils/spacingConstants';
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
    <section className={`${closingCardSpacing} text-center`}>
      <h2 className='font-heading text-body-5xl uppercase tracking-[4px] text-brand-white mb-4'>
        {title}
      </h2>
      <p className='text-brand-muted max-w-150 mx-auto mb-8 text-body-base leading-relaxed'>
        {message}
      </p>
      <CTA
        href={href}
        variant='filled'
        target={shouldOpenInNewTab ? '_blank' : undefined}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}>
        {ctaText}
        {shouldOpenInNewTab && <FaExternalLinkAlt className='ml-4' />}
      </CTA>
    </section>
  );
};

export default ClosingCta;
