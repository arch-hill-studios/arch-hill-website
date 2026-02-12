'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import Divider from '@/components/UI/Divider';
import {
  VerticalNavData,
  VerticalNavCTAData,
  isNavigationSection,
  isNavigationLink,
  getNavLinkProps,
  getNavLinkLabel,
} from '@/utils/navigationHelpers';
import CTAList from '@/components/UI/CTAList';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { BUSINESS_CONTACT_INFO_QUERY_RESULT } from '@/sanity/types';

interface VerticalNavProps {
  isMenuOpen: boolean;
  onClose: () => void;
  navLinks: VerticalNavData | null;
  navCtas: VerticalNavCTAData | null;
  organizationName: string;
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
}

const VerticalNav = ({ isMenuOpen, onClose, navLinks, navCtas }: VerticalNavProps) => {
  const pathname = usePathname();
  useBodyScrollLock(isMenuOpen);
  const focusTrapRef = useFocusTrap(isMenuOpen);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when menu opens
  useEffect(() => {
    if (isMenuOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isMenuOpen]);

  return (
    <div
      className={`fixed inset-0 top-17.5 z-40 transition-[opacity,visibility] duration-300 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
      {/* Background overlay - click to close */}
      <div
        className='absolute inset-0 bg-black/60'
        onClick={onClose}
      />

      {/* Dropdown panel - slides down from top */}
      <div
        ref={(el) => {
          focusTrapRef.current = el as HTMLElement;
        }}
        id='mobile-navigation-menu'
        role='dialog'
        aria-modal='true'
        aria-label='Main navigation menu'
        className={`absolute top-0 left-0 right-0 bg-[rgba(10,10,10,0.98)] border-b border-[#2a2a2a] shadow-2xl transition-transform duration-300 ease-in-out max-h-[calc(100vh-70px)] overflow-hidden ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
        {/* Scrollable content */}
        <div
          ref={scrollContainerRef}
          className='overflow-y-auto overflow-x-hidden max-h-[calc(100vh-70px)]'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#430c08 transparent',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
          }}>
          {/* Navigation Links */}
          <nav className='py-5 w-full'>
            <div>
              {navLinks && navLinks.length > 0 ? (
                <>
                  {navLinks
                    .filter((section) => {
                      if (!isNavigationSection(section)) return false;
                      if (section.hideSection) return false;
                      return true;
                    })
                    .map((section, sectionIndex, filteredSections) => {
                      if (!isNavigationSection(section)) return null;

                      const sectionVisibilityClass = section.hideOnDesktop ? 'lg:hidden' : '';

                      return (
                        <div key={`nav-section-${sectionIndex}`} className={sectionVisibilityClass}>
                          {/* Section Heading */}
                          {section.heading && (
                            <div className='px-5 pt-4 pb-2'>
                              <p className='uppercase tracking-wide text-[#999] text-body-xs text-center'>
                                {section.heading}
                              </p>
                            </div>
                          )}

                          {/* Section Links */}
                          {section.links?.map((link, linkIndex) => {
                            if (!isNavigationLink(link)) return null;
                            if (link.hideLink) return null;

                            const linkProps = getNavLinkProps(link);
                            const label = getNavLinkLabel(link);
                            const isExternal = link.linkType === 'external' || link.openInNewTab;
                            const linkVisibilityClass = link.hideOnDesktop ? 'lg:hidden' : '';

                            const href = link.computedHref || '/';
                            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

                            return (
                              <div
                                key={`nav-link-${sectionIndex}-${linkIndex}`}
                                className={linkVisibilityClass}>
                                <Link
                                  {...linkProps}
                                  onClick={onClose}
                                  className={`block w-full text-center py-3.5 px-5 font-heading text-body-lg uppercase tracking-[2px] transition-colors duration-300 ${
                                    isActive ? 'text-brand-white' : 'text-[#999] hover:text-brand-white'
                                  }`}>
                                  <span>{label}</span>
                                  {isExternal && (
                                    <FaExternalLinkAlt className='inline-block text-body-xs text-current ml-2' />
                                  )}
                                </Link>
                              </div>
                            );
                          })}

                          {/* Add divider between sections (but not after the last section) */}
                          {sectionIndex < filteredSections.length - 1 && (
                            <div className='px-10 py-3'>
                              <Divider size='half' color='light' />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </>
              ) : (
                <div className='text-body-base text-center py-4'>No navigation links configured</div>
              )}
            </div>
          </nav>

          {/* Navigation CTAs */}
          {navCtas && navCtas.length > 0 && (
            <div className='w-full px-10 pb-6'>
              <div className='pt-4 border-t border-brand-primary/50'>
                <div className='pt-4'>
                  <CTAList
                    ctaList={navCtas}
                    alignment='flex-col'
                    fullWidth={true}
                    onClick={onClose}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalNav;
