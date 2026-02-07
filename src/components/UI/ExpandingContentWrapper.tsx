'use client';

import React, { useState, ReactNode } from 'react';
import MoreInfoToggle from './MoreInfoToggle';

interface ExpandingContentWrapperProps {
  children: ReactNode;
  showOnDesktop?: boolean;
  expandLabel?: string;
  collapseLabel?: string;
  className?: string;
  alwaysCentered?: boolean;
}

const ExpandingContentWrapper = ({
  children,
  showOnDesktop = false,
  expandLabel = 'Read More',
  collapseLabel = 'Read Less',
  className = '',
  alwaysCentered = false,
}: ExpandingContentWrapperProps) => {
  // State for expansion
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine the conditional class based on showOnDesktop
  // If showOnDesktop is false, hide expand/collapse on desktop (lg breakpoint) and show content expanded
  // If showOnDesktop is true, show expand/collapse on all screen sizes
  const expandableClass = showOnDesktop
    ? // Show expand/collapse on all screen sizes
      `${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`
    : // Hide expand/collapse on desktop (lg+), show content expanded
      `${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} lg:max-h-none! lg:opacity-100!`;

  return (
    <div className={`w-full mx-auto ${className}`.trim()}>
      {/* Expandable Content Container */}
      <div
        className={`
          overflow-hidden ${isExpanded ? 'mb-4' : ''} transition-all duration-500 ease-in-out
          ${expandableClass}
        `}>
        {children}
      </div>

      {/* Expand/Collapse Toggle */}
      <MoreInfoToggle
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        expandLabel={expandLabel}
        collapseLabel={collapseLabel}
        showOnDesktop={showOnDesktop}
        alwaysCentered={alwaysCentered}
      />
    </div>
  );
};

export default ExpandingContentWrapper;
