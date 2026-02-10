'use client';

import React from 'react';
import Link from 'next/link';
import {
  HorizontalNavData,
  HorizontalNavCTAData,
  getHorizontalNavLinkProps,
  getHorizontalNavLinkLabel,
} from '@/utils/navigationHelpers';
import CTAList from '@/components/UI/CTAList';

interface HorizontalNavProps {
  navLinks: HorizontalNavData | null;
  navCtas: HorizontalNavCTAData | null;
}

const HorizontalNav = ({ navLinks, navCtas }: HorizontalNavProps) => {
  const hasLinks = navLinks && navLinks.length > 0;
  const hasCtas = navCtas && navCtas.length > 0;

  // If no links and no CTAs, don't render anything
  if (!hasLinks && !hasCtas) {
    return null;
  }

  // Filter out hidden links
  const visibleLinks = hasLinks ? navLinks.filter((link) => !link.hideLink) : [];

  return (
    <nav>
      <div className='flex items-center gap-6'>
        {/* Navigation Links */}
        {visibleLinks.length > 0 && (
          <ul className='flex items-center gap-10'>
            {visibleLinks.map((link, index) => {
              const linkProps = getHorizontalNavLinkProps(link);
              const label = getHorizontalNavLinkLabel(link);
              return (
                <li key={`${link.computedHref}-${index}`}>
                  <Link
                    {...linkProps}
                    className='relative font-heading text-body-lg uppercase tracking-[2px] text-[#999] hover:text-brand-white transition-colors duration-300 after:absolute after:-bottom-1.25 after:left-0 after:w-0 after:h-0.5 after:bg-brand-primary after:transition-[width] after:duration-300 hover:after:w-full'>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Navigation CTAs on far right */}
        {hasCtas && (
          <div className='ml-6'>
            <CTAList ctaList={navCtas} alignment='flex-row' fullWidth={false} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default HorizontalNav;
