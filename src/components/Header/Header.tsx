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
import { headerHeight } from '@/utils/spacingConstants';

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
  // Scrolled state: controls logo visibility and nav position on desktop
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Set opacity and scrolled state when no hero is present
  useEffect(() => {
    if (!enableOpacityFade) {
      // No hero: header is always opaque and in "scrolled" state (logo visible, nav right)
      const timer = setTimeout(() => {
        setHeaderOpacity(1);
        setIsScrolled(true);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [enableOpacityFade]);

  // Handle scroll for header background opacity fade AND scrolled state
  useEffect(() => {
    // Only add scroll listener if opacity fade is enabled (hero present)
    if (!enableOpacityFade) return;

    const handleScroll = () => {
      // Don't update when menu is open - prevents scroll lock from resetting
      if (isMenuOpen) return;

      const scrollY = window.scrollY;

      // Fade in background over first 30px of scroll
      const opacity = Math.min(scrollY / 30, 1);
      setHeaderOpacity(opacity);

      // Scrolled state: triggers at 60% of hero height (logo appears, nav shifts right)
      const heroElement = document.querySelector('[data-hero]');
      if (heroElement) {
        const heroHeight = heroElement.getBoundingClientRect().height;
        const triggerPoint = heroHeight * 0.6;
        setIsScrolled(scrollY > triggerPoint);
      } else {
        setIsScrolled(true);
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

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

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  /*
    HEADER HEIGHT DEFINITION:
    -> Imported from spacingConstants.ts as headerHeight constant (70px)

    ⚠️ IMPORTANT: If height is changed, update:
    - src/utils/spacingConstants.ts (headerHeight and headerHeightCalc)
    - src/app/globals.css (scroll-padding-top)
    - src/app/layout.tsx (inline critical CSS scroll-padding-top)
    - src/components/HomeHero/styles.module.css
    - src/components/Header/VerticalNav/VerticalNav.tsx
  */
  return (
    <>
      <SkipLink href='#main-content'>Skip to main content</SkipLink>
      <header
        className={`fixed top-0 left-0 right-0 w-full ${headerHeight} z-50 border-b bg-brand-dark border-[#2a2a2a]`}>
        {/* Inner container - relative for absolute positioning of logo and nav on desktop */}
        <div className='relative mx-auto max-w-300 h-full flex items-center justify-between xl:justify-center px-5'>
          {/* Logo + Brand Text */}
          {/* Desktop (xl+): absolute left, hidden initially on hero pages, fades in on scroll */}
          {/* Mobile/Tablet (< xl): always visible, flow-positioned left */}
          <Link
            href='/#home'
            onClick={closeMenu}
            className={`flex items-center gap-2 xl:absolute xl:left-5 transition-[opacity,transform] duration-400 ease-in-out ${
              isScrolled ? 'xl:opacity-100 xl:translate-x-0' : 'xl:opacity-0 xl:-translate-x-5'
            }`}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))',
            }}>
            {logo?.asset && (
              <UnifiedImage
                src={logo}
                alt={logo.alt || `${organizationName} Logo`}
                mode='sized'
                width={80}
                height={40}
                sizeContext='logo'
                objectFit='contain'
                className='h-10 w-auto'
                sizes='40px'
                priority
              />
            )}
            {/* Brand Text - Image from CMS or fallback to organization name */}
            <div className='hidden xxs:flex items-center'>
              {brandTextImage?.asset ? (
                <UnifiedImage
                  src={brandTextImage}
                  alt={brandTextImage.alt || organizationName}
                  mode='sized'
                  width={300}
                  height={40}
                  sizeContext='full'
                  objectFit='contain'
                  className='shrink-0 max-h-10 max-w-none'
                  style={{ width: 'auto', height: 'auto' }}
                />
              ) : (
                <span className='text-h3 text-brand-primary'>{organizationName}</span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation - absolute positioned, transitions from center to right */}
          <div
            className={`hidden xl:block absolute transition-[left,transform] duration-400 ease-in-out ${
              isScrolled ? 'left-[calc(100%-20px)] -translate-x-full' : 'left-1/2 -translate-x-1/2'
            }`}>
            <HorizontalNav
              navLinks={headerData?.horizontalNav || null}
              navCtas={headerData?.horizontalNavCtas || null}
            />
          </div>

          {/* Hamburger / Close Menu Button */}
          <MenuButton
            isMenuOpen={isMenuOpen}
            onClick={toggleMenu}
            ariaControls='mobile-navigation-menu'
            showOnDesktop={headerData?.showVerticalNavOnDesktop ?? true}
          />
        </div>
      </header>

      {/* Vertical Menu (dropdown) */}
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
