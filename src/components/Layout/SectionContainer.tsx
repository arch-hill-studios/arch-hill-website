import React from 'react';
import { sectionContainerPadding, sectionContainerPaddingCompact } from '@/utils/spacingConstants';

interface SectionContainerProps {
  children: React.ReactNode;
  useCompactPadding?: boolean;
  className?: string;
}

/**
 * SectionContainer - Internal container for PageSection and ContentWrapper components
 *
 * This component provides consistent internal spacing (padding) for section content
 * while allowing the parent section to have full-width backgrounds.
 *
 * Key features:
 * - Horizontal padding matches the main Container component (px-4 sm:px-20)
 * - Vertical padding creates breathing room between sections (py-12 md:py-16)
 * - Max-width constraint keeps content readable
 * - Centered alignment maintains visual balance
 *
 * @param useCompactPadding - Use smaller padding for tighter visual flow
 * @param className - Additional classes to apply
 */
const SectionContainer = ({
  children,
  useCompactPadding = false,
  className = '',
}: SectionContainerProps) => {
  const paddingClass = useCompactPadding ? sectionContainerPaddingCompact : sectionContainerPadding;

  return <div className={`mx-auto ${paddingClass} ${className}`.trim()}>{children}</div>;
};

export default SectionContainer;
