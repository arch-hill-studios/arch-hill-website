'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import UnifiedImage from '@/components/UI/UnifiedImage';
import type { HEADER_QUERY_RESULT, BUSINESS_CONTACT_INFO_QUERY_RESULT } from '@/sanity/types';
import { getBrandTextImage, getLogo } from '@/lib/organizationInfo';
import HorizontalNav from './HorizontalNav';
import MenuButton from './MenuButton';
import VerticalNav from './VerticalNav/VerticalNav';
import SkipLink from '@/components/UI/SkipLink';
import { useHeader } from '@/contexts/HeaderContext';
import { headerHeight, sitePaddingX } from '@/utils/spacingConstants';

interface HeaderProps {
  headerData: HEADER_QUERY_RESULT | null;
  organizationName: string;
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
}

const Header = ({ headerData, organizationName, businessContactInfo }: HeaderProps) => {
  const logo = getLogo(businessContactInfo);
  const brandTextImage = getBrandTextImage(businessContactInfo);
  const { enableOpacityFade } = useHeader();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Always start transparent - useEffect will set correct value
  const [headerOpacity, setHeaderOpacity] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Set opacity based on enableOpacityFade state
  useEffect(() => {
    if (!enableOpacityFade) {
      // Delay setting opacity to allow Hero to mount and update context first
      const timer = setTimeout(() => {
        setHeaderOpacity(1);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [enableOpacityFade]);

  // Handle scroll for header background opacity fade
  useEffect(() => {
    // Only add scroll listener if opacity fade is enabled
    if (!enableOpacityFade) return;

    const handleScroll = () => {
      // Don't update opacity when menu is open - prevents scroll lock from resetting opacity to 0
      if (isMenuOpen) return;

      const scrollY = window.scrollY;
      // Fade in background over first xxpx of scroll
      const opacity = Math.min(scrollY / 30, 1);
      setHeaderOpacity(opacity);
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enableOpacityFade, isMenuOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  /*
    HEADER HEIGHT DEFINITION:
    -> Imported from spacingConstants.ts as headerHeight constant

    ⚠️ IMPORTANT: If these heights are changed, update:
    - src/utils/spacingConstants.ts (headerHeight and headerHeightCalc)
    - src/components/HomeHero/styles.module.css
    - src/components/Header/VerticalNav/VerticalNav.tsx
  */
  return (
    <>
      <SkipLink href='#main-content'>Skip to main content</SkipLink>
      <header
        className={`fixed top-0 left-0 right-0 w-full ${sitePaddingX} ${headerHeight} flex items-center justify-between gap-8 z-50 transition-all duration-300`}
        style={{
          background: `linear-gradient(90deg, rgba(var(--color-charcoal-gradient-start), ${headerOpacity}) 0%, rgba(var(--color-charcoal-gradient-end), ${headerOpacity}) 100%)`,
        }}>
        {/* Logo */}
        <Link
          href='/#home'
          onClick={closeMenu}
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
              priority
            />
          )}
          {/* Brand Text - Image from CMS or fallback to organization name */}
          <div className='hidden xxs:flex items-baseline gap-2'>
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

{/* Desktop Navigation */}
        <div className='grow flex justify-end'>
          <HorizontalNav
            navLinks={headerData?.horizontalNav || null}
            navCtas={headerData?.horizontalNavCtas || null}
          />
        </div>

        {/* Hamburger Menu Button */}
        <MenuButton
          variant='hamburger'
          isMenuOpen={isMenuOpen}
          onClick={toggleMenu}
          ariaControls='mobile-navigation-menu'
          showOnDesktop={headerData?.showVerticalNavOnDesktop ?? true}
        />
      </header>

      {/* Vertical Menu */}
      <VerticalNav
        isMenuOpen={isMenuOpen}
        onClose={closeMenu}
        navLinks={headerData?.verticalNav || null}
        navCtas={headerData?.verticalNavCtas || null}
        organizationName={organizationName}
        businessContactInfo={businessContactInfo}
      />

    </>
  );
};

export default Header;
