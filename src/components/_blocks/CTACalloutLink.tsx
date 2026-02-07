import React from 'react';
import { stegaClean } from 'next-sanity';
import { urlFor } from '@/sanity/lib/image';
import type { CTACalloutLinkBlock } from '@/types/blocks';
import type { CTABlockProps } from '@/types/shared';
import CTACalloutLink from '../UI/CTACalloutLink';

type CTACalloutLinkProps = CTABlockProps<CTACalloutLinkBlock>;

const CTACalloutLinkComponent = ({
  heading,
  text,
  image,
  linkType,
  internalLink,
  externalUrl,
  openInNewTab = false,
  computedHref,
  className = '',
}: CTACalloutLinkProps) => {
  const cleanHeading = stegaClean(heading);
  const cleanText = stegaClean(text);
  const cleanExternalUrl = stegaClean(externalUrl);

  // Don't render if no content at all (no heading, text, or image)
  if (!cleanHeading && !cleanText && !image?.asset) {
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

  // Determine if this should open in a new tab
  const shouldOpenInNewTab = linkType === 'external' || (linkType === 'internal' && openInNewTab);

  // Process image if provided
  let processedImage;
  if (image?.asset) {
    const imageUrl = urlFor(image.asset).width(840).height(840).url();
    const altText = stegaClean(image.alt) || 'Callout image';

    processedImage = {
      src: imageUrl,
      alt: altText,
      width: 840,
      height: 840,
    };
  }

  return (
    <div className={className}>
      <CTACalloutLink
        heading={cleanHeading}
        text={cleanText}
        image={processedImage}
        href={href}
        target={shouldOpenInNewTab ? '_blank' : undefined}
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
      />
    </div>
  );
};

export default CTACalloutLinkComponent;
