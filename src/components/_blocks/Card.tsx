import React from 'react';
import { stegaClean } from 'next-sanity';
import type { CardBlock } from '@/types/blocks';
import type { CTABlockProps } from '@/types/shared';
import CardGradient from '../UI/CardGradient';

type CardProps = CTABlockProps<CardBlock>;

const CardComponent = ({
  title,
  body,
  ctaText,
  linkType,
  internalLink,
  externalUrl,
  openInNewTab = false,
  computedHref,
  className = '',
}: CardProps) => {
  const cleanTitle = stegaClean(title);
  const cleanBody = stegaClean(body);
  const cleanCtaText = stegaClean(ctaText);
  const cleanExternalUrl = stegaClean(externalUrl);

  // Don't render if missing required fields
  if (!cleanTitle || !cleanBody || !cleanCtaText) {
    return null;
  }

  // Use computed href from enhanced GROQ query if available, otherwise fallback to legacy logic
  let href = '';

  if (computedHref) {
    href = stegaClean(computedHref);
  } else {
    if (linkType === 'internal') {
      if (internalLink) {
        // Handle both reference objects and dereferenced objects
        if ('href' in internalLink && internalLink.href) {
          // Use the pre-computed href from the GROQ query
          href = internalLink.href;
        } else if ('slug' in internalLink && internalLink.slug?.current) {
          // Fallback to slug-based URL for backward compatibility
          href = `/${internalLink.slug.current}`;
        }
        // If it's just a reference, we can't build the URL without dereferencing
        // This would need to be handled in the GROQ query by dereferencing with ->
      } else {
        // Default to home page if no internal link is selected
        href = '/';
      }
    } else if (linkType === 'external' && cleanExternalUrl) {
      href = cleanExternalUrl;
    }
  }

  // Don't render if no valid href
  if (!href) {
    return null;
  }

  return (
    <CardGradient
      title={cleanTitle}
      body={cleanBody}
      ctaText={cleanCtaText}
      ctaHref={href}
      className={className}
    />
  );
};

export default CardComponent;
