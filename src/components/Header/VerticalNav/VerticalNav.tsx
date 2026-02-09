'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import UnifiedImage from '@/components/UI/UnifiedImage';
import MenuButton from '../MenuButton';
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
import styles from './VerticalNav.module.css';
import { headerHeight } from '@/utils/spacingConstants';
import type { BUSINESS_CONTACT_INFO_QUERY_RESULT } from '@/sanity/types';
import { getBrandTextImage, getLogo } from '@/lib/organizationInfo';

interface VerticalNavProps {
  isMenuOpen: boolean;
  onClose: () => void;
  navLinks: VerticalNavData | null;
  navCtas: VerticalNavCTAData | null;
  organizationName: string;
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
}

const VerticalNav = ({ isMenuOpen, onClose, navLinks, navCtas, organizationName, businessContactInfo }: VerticalNavProps) => {
  const logo = getLogo(businessContactInfo);
  const brandTextImage = getBrandTextImage(businessContactInfo);
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
      /* NOTE: Breakpoint behavior - Uses 'sm:' breakpoint to determine layout mode */
      /* Small screens (< sm): z-60 (in front of header), full-screen fade */
      /* Larger screens (>= sm): z-60 (in front of header), slide-in from right */
      className={`fixed inset-0 transition-opacity duration-300 z-60 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
      {/* Background Overlay - only visible on larger screens for slide-in effect */}
      <div
        className={`hidden sm:block ${styles.overlay} ${isMenuOpen ? styles.overlayOpen : styles.overlayClosed}`}
        onClick={onClose}
      />

      {/* Menu Sidebar */}
      {/* NOTE: Breakpoint behavior - 'sm:' determines when slide-in activates */}
      {/* Small screens (< sm): full screen, fade in/out */}
      {/* Larger screens (>= sm): slide from right, fixed width */}
      <div
        ref={(el) => {
          // Type assertion is safe here since div element extends HTMLElement
          focusTrapRef.current = el as HTMLElement;
        }}
        id='mobile-navigation-menu'
        role='dialog'
        aria-modal='true'
        aria-label='Main navigation menu'
        className={`fixed flex flex-col bg-brand-gradient-dark-radial transition-opacity duration-300 inset-0 sm:inset-auto sm:top-0 sm:right-0 sm:bottom-0 sm:w-90 sm:shadow-2xl sm:transition-transform sm:duration-300 sm:ease-in-out ${
          isMenuOpen ? 'sm:translate-x-0' : 'sm:translate-x-full'
        }`}>
        {/* Menu Header - now visible on all screen sizes with logo and close button */}
        <div
          className={`flex items-center justify-between px-4 md:px-8 ${headerHeight} transition-all duration-300 relative`}>
          {/* Logo and Business Name */}
          <Link
            href='/#home'
            onClick={onClose}
            className='flex items-center gap-2 transition-opacity duration-300'
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
            }}>
            {logo?.asset && (
              <UnifiedImage
                src={logo}
                alt={logo.alt || `${organizationName} Logo`}
                mode='sized'
                width={80}
                height={50}
                sizeContext='logo'
                objectFit='contain'
                className='w-14 md:w-20 h-auto'
                sizes='(max-width: 768px) 56px, 80px'
              />
            )}
            {/* Brand Text - Image from CMS or fallback to organization name - visible on small screens only */}
            <div className='flex sm:hidden items-baseline gap-2'>
              {brandTextImage?.asset ? (
                <UnifiedImage
                  src={brandTextImage}
                  alt={brandTextImage.alt || organizationName}
                  mode='sized'
                  width={150}
                  height={40}
                  objectFit='contain'
                  className='h-8 md:h-10 w-auto'
                />
              ) : (
                <span
                  className='text-h3'
                  style={{
                    background: 'var(--background-image-brand-gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  {organizationName}
                </span>
              )}
            </div>
          </Link>

          {/* Close Button */}
          <MenuButton variant='close' onClick={onClose} isMenuOpen={isMenuOpen} />
        </div>

        {/* Menu Navigation */}
        <div
          ref={scrollContainerRef}
          className='flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center sm:items-start text-center sm:text-left'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#430c08 transparent',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.scrollbarColor = '#430c08 transparent';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.scrollbarColor = '#430c08 transparent';
          }}>
          {/* Navigation Links - grows to fill available space */}
          <nav className='px-10 py-12 w-full grow'>
            <div className='space-y-8'>
              {navLinks && navLinks.length > 0 ? (
                <>
                  {navLinks
                    .filter((section) => {
                      if (!isNavigationSection(section)) return false;
                      // Filter out sections that should be hidden entirely
                      if (section.hideSection) return false;
                      // Filter out sections hidden on desktop if we're on desktop
                      // RESPONSIVE VISIBILITY: hideOnDesktop aligns with HorizontalNav's lg breakpoint
                      // ⚠️ IMPORTANT: If HorizontalNav.tsx line 25 'lg:flex' changes, update this 'lg:hidden' accordingly
                      return true; // Let CSS handle desktop hiding
                    })
                    .map((section, sectionIndex, filteredSections) => {
                      if (!isNavigationSection(section)) return null;

                      // RESPONSIVE VISIBILITY: hideOnDesktop aligns with HorizontalNav's lg breakpoint
                      // ⚠️ IMPORTANT: If HorizontalNav.tsx line 25 'lg:flex' changes, update this 'lg:hidden' accordingly
                      const sectionVisibilityClass = section.hideOnDesktop ? 'lg:hidden' : '';

                      return (
                        <div key={`nav-section-${sectionIndex}`} className={sectionVisibilityClass}>
                          {/* Section Heading */}
                          {section.heading && (
                            <div className='mb-4'>
                              <p className='uppercase tracking-wide text-subtle/70'>
                                {section.heading}
                              </p>
                            </div>
                          )}

                          {/* Section Links */}
                          <div className='space-y-6 flex flex-col items-center sm:items-start'>
                            {section.links?.map((link, linkIndex) => {
                              if (!isNavigationLink(link)) return null;

                              // Skip hidden navigation links
                              if (link.hideLink) return null;

                              const linkProps = getNavLinkProps(link);
                              const label = getNavLinkLabel(link);
                              const isExternal = link.linkType === 'external' || link.openInNewTab;

                              // RESPONSIVE VISIBILITY: hideOnDesktop aligns with HorizontalNav's lg breakpoint
                              // ⚠️ IMPORTANT: If HorizontalNav.tsx line 25 'lg:flex' changes, update this 'lg:hidden' accordingly
                              const linkVisibilityClass = link.hideOnDesktop ? 'lg:hidden' : '';

                              return (
                                <div
                                  key={`nav-link-${sectionIndex}-${linkIndex}`}
                                  className={linkVisibilityClass}>
                                  <Link
                                    {...linkProps}
                                    onClick={onClose}
                                    className='text-xl flex items-center justify-between w-full text-brand-white hover:text-brand-primary transition-colors'>
                                    <span>{label}</span>
                                    {isExternal && (
                                      <FaExternalLinkAlt className='text-body-xs text-current ml-2 shrink-0' />
                                    )}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>

                          {/* Add divider between sections (but not after the last section) */}
                          {sectionIndex < filteredSections.length - 1 && (
                            <div className='pt-6'>
                              <Divider size='half' color='light' />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </>
              ) : (
                <div className='text-body-base text-center'>No navigation links configured</div>
              )}
            </div>
          </nav>

          {/* Navigation CTAs - pinned to bottom on tall screens */}
          {navCtas && navCtas.length > 0 && (
            <div className='w-full px-10 pb-10 mt-auto'>
              <div className='pt-6 border-t border-brand-primary/50'>
                <div className='pt-6'>
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
        {/* End Menu Sidebar */}
      </div>
      {/* End Wrapper */}
    </div>
  );
};

export default VerticalNav;
