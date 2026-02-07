import React from 'react';
import CTAButton from '../_blocks/CTAButton';
import type { CTAButtonBlock } from '@/types/blocks';

interface CTAListItem {
  _type: 'embeddedCtaButton';
  _key: string;
  [key: string]: unknown; // Allow additional properties from the CTA button types
}

interface CTAListProps {
  ctaList: CTAListItem[] | null | undefined;
  alignment?: 'flex-row' | 'flex-col' | 'flex-col-left';
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
}

const CTAList = ({
  ctaList,
  alignment = 'flex-row',
  className = '',
  fullWidth = false,
  onClick,
}: CTAListProps) => {
  // Return nothing if no CTAs
  if (!ctaList || ctaList.length === 0) {
    return null;
  }

  // Get base alignment classes
  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'flex-row':
        // Desktop/tablet: horizontal layout, Mobile: vertical layout
        return 'flex flex-col md:flex-row justify-start items-center gap-4';

      case 'flex-col-left':
        // Always vertical layout, but aligned to the left
        return 'flex flex-col justify-center items-start gap-4';

      case 'flex-col':
      default:
        // Always vertical layout, centered
        return 'flex flex-col justify-center items-center gap-4';
    }
  };

  return (
    <div className={`${getAlignmentClasses()} ${className}`.trim()}>
      {ctaList.map((cta) => {
        // Apply full width class if fullWidth prop is true
        const ctaClassName = fullWidth ? 'w-full' : '';

        if (cta._type === 'embeddedCtaButton') {
          return (
            <CTAButton
              key={cta._key}
              text={cta.text as string}
              variant={cta.variant as CTAButtonBlock['variant']}
              linkType={cta.linkType as CTAButtonBlock['linkType']}
              internalLink={cta.internalLink as CTAButtonBlock['internalLink']}
              externalUrl={cta.externalUrl as string}
              openInNewTab={cta.openInNewTab as boolean}
              computedHref={cta.computedHref as string}
              pageSectionId={cta.pageSectionId as string}
              className={ctaClassName}
              onClick={onClick}
            />
          );
        }
        // embeddedCtaEmailButton type exists in schema but is not rendered
        return null;
      })}
    </div>
  );
};

export default CTAList;
