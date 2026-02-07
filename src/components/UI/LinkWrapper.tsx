import React from 'react';
import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import type { InternalLinkType } from '@/types/shared';

interface LinkWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  linkType?: "none" | "internal" | "external" | null;
  internalLink?: InternalLinkType;
  externalUrl?: string | null;
  openInNewTab?: boolean | null;
  computedHref?: string | null;
  pageSectionId?: string | null;
}

const LinkWrapper = ({
  children,
  className = '',
  style,
  linkType,
  internalLink,
  externalUrl,
  openInNewTab = false,
  computedHref,
  pageSectionId,
}: LinkWrapperProps) => {
  const cleanExternalUrl = stegaClean(externalUrl);
  const cleanPageSectionId = stegaClean(pageSectionId);

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

  // Add section anchor if provided
  if (href && cleanPageSectionId) {
    href += `#${cleanPageSectionId}`;
  }

  // If no valid href, no linkType, or linkType is 'none', return children without wrapper
  if (!href || !linkType || linkType === 'none') {
    return <div className={className} style={style}>{children}</div>;
  }

  // Determine if this should open in a new tab
  const shouldOpenInNewTab = linkType === 'external' || (linkType === 'internal' && openInNewTab);

  // Use Next.js Link for internal links, regular anchor for external links or when target="_blank"
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  const shouldUseAnchor = isExternal || shouldOpenInNewTab;

  if (shouldUseAnchor) {
    return (
      <a 
        href={href} 
        target={shouldOpenInNewTab ? '_blank' : undefined} 
        rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
};

export default LinkWrapper;