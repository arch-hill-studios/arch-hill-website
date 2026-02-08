'use client';

import React from 'react';
import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import UnifiedImage from '@/components/UI/UnifiedImage';
import { SocialIcon, type SocialPlatform, getPlatformLabel } from '@/utils/socialIcons';
import { cleanPlatform } from '@/utils/cleanPlatform';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { detectPlatformFromUrl } from '@/sanity/schemaTypes/shared/platformsConfig';
import { usePageLoad } from '@/contexts/PageLoadContext';
import type {
  FOOTER_QUERYResult,
  COMPANY_LINKS_QUERYResult,
  LEGAL_PAGES_VISIBILITY_QUERYResult,
  BUSINESS_CONTACT_INFO_QUERYResult,
} from '@/sanity/types';
import {
  getOrganizationEmail,
  getOrganizationEmailLink,
  getOrganizationPhone,
  getOrganizationPhoneLink,
  getOrganizationAddress,
  getOrganizationAddressLink,
  getBrandTextImage,
  getLogo,
} from '@/lib/organizationInfo';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { GoLocation } from 'react-icons/go';

interface FooterMessage {
  _key: string;
  title?: string | null;
  message?: string | null;
}

interface FooterProps {
  footerData: FOOTER_QUERYResult | null;
  companyLinksData: COMPANY_LINKS_QUERYResult | null;
  legalPagesVisibilityData: LEGAL_PAGES_VISIBILITY_QUERYResult | null;
  organizationName: string;
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERYResult | null;
}

const Footer = ({
  footerData,
  companyLinksData,
  legalPagesVisibilityData,
  organizationName,
  businessContactInfo,
}: FooterProps) => {
  const { isPageReady } = usePageLoad();
  const logo = getLogo(businessContactInfo);
  const brandTextImage = getBrandTextImage(businessContactInfo);

  // Build contact details array, filtering out empty values
  const contactDetails = [
    {
      icon: <FaPhoneAlt />,
      value: getOrganizationPhone(businessContactInfo),
      link: getOrganizationPhoneLink(businessContactInfo),
    },
    {
      icon: <MdEmail />,
      value: getOrganizationEmail(businessContactInfo),
      link: getOrganizationEmailLink(businessContactInfo),
    },
    {
      icon: <GoLocation />,
      value: getOrganizationAddress(businessContactInfo),
      link: getOrganizationAddressLink(businessContactInfo),
    },
  ].filter((detail) => detail.value);

  // Get quick links from CMS, filtering out invalid entries
  const quickLinks =
    footerData?.quickLinks?.filter((link) => {
      if (!link.label) return false;

      // Check if link has valid href (computed or manual)
      if (link.computedHref) return true;

      // Fallback checks
      if (link.linkType === 'internal' && link.internalLink?.href) return true;
      if (link.linkType === 'external' && link.externalUrl) return true;

      return false;
    }) || [];

  // Get company links from company links data, filtering out hidden ones and invalid entries
  const companyLinks =
    companyLinksData?.companyLinks?.socialLinksArray?.filter((link) => {
      if (!link.url || link.hideFromFooter) return false;

      // Get final platform from auto-detection or manual selection
      const detected = detectPlatformFromUrl(link.url);
      const finalPlatform = detected?.key || link.platform;

      return finalPlatform && typeof finalPlatform === 'string' && finalPlatform.trim() !== '';
    }) || [];

  // Transform company links to display format with final platform values
  const transformedLinks = companyLinks.map((link) => {
    const detected = detectPlatformFromUrl(link.url!);
    const finalPlatform = detected?.key || link.platform;
    const platform = cleanPlatform(finalPlatform) as SocialPlatform;

    return {
      _key: link._key,
      platform,
      url: link.url!,
      label: platform === 'genericLink' ? link.customTitle || 'Link' : getPlatformLabel(platform),
    };
  });

  // Cast footer data to include proper footerMessages array
  const footerMessages =
    footerData?._type === 'footer'
      ? (footerData as unknown as { footerMessages?: FooterMessage[] })?.footerMessages
      : null;

  return (
    <footer
      className={`bg-brand-gradient-charcoal-linear text-brand-white pt-16 pb-10 px-6 md:px-16 w-full transition-opacity duration-500 ease-in-out ${
        isPageReady ? 'opacity-100' : 'opacity-0'
      }`}
      aria-label='Site Footer'>
      <div className='container mx-auto'>
        {/* TOP ROW */}
        <div className='flex flex-col lg:flex-row gap-x-10 gap-y-12 justify-between'>
          {/* LOGO & MESSAGE */}
          <div className='flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0 lg:max-w-1/3'>
            {/* Logo */}
            <Link
              href='/#home'
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

            {/* Messages */}
            {footerMessages && footerMessages.length > 0 && (
              <div className='space-y-4 mt-8'>
                {footerMessages.map((message) => (
                  <div key={message._key} className='space-y-1'>
                    {message.title && <div className='font-bold text-subtle'>{message.title}</div>}
                    {message.message && (
                      <div className='text-brand-white text-body-lg'>{message.message}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LINKS */}
          <div className='flex flex-col md:flex-row md:justify-between lg:justify-start gap-x-16 gap-y-16 text-center md:text-left'>
            {/* Contact Details */}
            <div className='md:order-last'>
              <p className='text-h6 mb-6 text-gradient-primary'>Contact</p>
              <div className='flex flex-col items-center md:items-start gap-4'>
                {contactDetails.map((detail, index) => (
                  <a
                    key={index}
                    href={detail.link}
                    className='flex items-center gap-4 hover:text-brand-primary transition-colors duration-200'
                    target={detail.link.startsWith('http') ? '_blank' : undefined}
                    rel={detail.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    <span className='text-brand-secondary'>{detail.icon}</span> {detail.value}
                  </a>
                ))}
              </div>
            </div>

            <div className='flex flex-row justify-around md:justify-between lg:justify-start gap-x-8 md:gap-x-16'>
              {/*  Quick Links */}
              {quickLinks.length > 0 && (
                <div>
                  <p className='text-h6 mb-6 text-gradient-primary'>Quick Links</p>
                  <div
                    className='flex flex-col items-center md:items-start gap-4'
                    {...createSanityDataAttribute('footer', 'footer', 'quickLinks')}>
                    {quickLinks.map((link) => {
                      // Use computed href from GROQ query (includes section anchors)
                      // or fallback to internalLink.href
                      let href = '';

                      if (link.computedHref) {
                        href = stegaClean(link.computedHref);
                      } else if (link.linkType === 'internal' && link.internalLink?.href) {
                        href = link.internalLink.href;
                        if (link.pageSectionId) {
                          href = `${href}#${stegaClean(link.pageSectionId)}`;
                        }
                      } else if (link.linkType === 'external' && link.externalUrl) {
                        href = stegaClean(link.externalUrl);
                      }

                      // Determine if this should open in a new tab
                      const shouldOpenInNewTab =
                        link.linkType === 'external' ||
                        (link.linkType === 'internal' && link.openInNewTab);

                      return (
                        <Link
                          key={link._key}
                          href={href}
                          target={shouldOpenInNewTab ? '_blank' : undefined}
                          rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
                          className='block text-brand-white hover:text-brand-primary transition-colors duration-200'
                          {...createSanityDataAttribute(
                            'footer',
                            'footer',
                            `quickLinks[_key=="${link._key}"]`,
                          )}>
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Company Links */}
              {transformedLinks.length > 0 && (
                <div className=''>
                  <p className='text-h6 mb-6 text-gradient-primary'>Connect</p>
                  <div
                    className='flex flex-col items-center md:items-start gap-4'
                    {...createSanityDataAttribute('companyLinks', 'companyLinks', 'companyLinks')}>
                    {transformedLinks.map((link) => (
                      <Link
                        key={link._key}
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={link.label}
                        title={link.label} // Hover text
                        className='transition-all duration-200 hover:text-brand-primary'
                        {...createSanityDataAttribute(
                          'companyLinks',
                          'companyLinks',
                          `companyLinks.socialLinksArray[_key=="${link._key}"]`,
                        )}>
                        <div className='rounded-full flex items-center justify-center gap-x-4 transition-transform duration-200'>
                          <SocialIcon
                            platform={link.platform}
                            className='text-body-xl text-brand-secondary'
                          />
                          <p>{link.label}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className='mt-12'>
          {/* Separator Line */}
          <div className='w-full h-px bg-brand-gradient-primary opacity-30 mb-6'></div>

          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            {/* Copyright */}
            {footerData?._type === 'footer' && footerData.copyrightText && (
              <div className='text-brand-white text-body-sm'>{footerData.copyrightText}</div>
            )}

            {/* Legal Links */}
            <div className='flex flex-wrap justify-center gap-6'>
              {!legalPagesVisibilityData?.termsAndConditions?.hide && (
                <Link
                  href='/terms-and-conditions'
                  className='text-brand-white hover:text-brand-primary transition-colors duration-200 text-body-sm'>
                  Terms & Conditions
                </Link>
              )}
              {!legalPagesVisibilityData?.privacyPolicy?.hide && (
                <Link
                  href='/privacy-policy'
                  className='text-brand-white hover:text-brand-primary transition-colors duration-200 text-body-sm'>
                  Privacy Policy
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
