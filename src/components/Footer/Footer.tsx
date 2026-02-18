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
import { sitePaddingX } from '@/utils/spacingConstants';
import type {
  FOOTER_QUERY_RESULT,
  COMPANY_LINKS_QUERY_RESULT,
  LEGAL_PAGES_VISIBILITY_QUERY_RESULT,
  BUSINESS_CONTACT_INFO_QUERY_RESULT,
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
  footerData: FOOTER_QUERY_RESULT | null;
  companyLinksData: COMPANY_LINKS_QUERY_RESULT | null;
  legalPagesVisibilityData: LEGAL_PAGES_VISIBILITY_QUERY_RESULT | null;
  organizationName: string;
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
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
      className={`bg-brand-dark text-brand-white pt-16 pb-8 w-full border-t border-[#2a2a2a] transition-opacity duration-500 ease-in-out ${
        isPageReady ? 'opacity-100' : 'opacity-0'
      }`}
      aria-label='Site Footer'>
      <div className={`${sitePaddingX} mx-auto`}>
        {/* TOP ROW - 3-column grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto] gap-x-16 gap-y-10 mb-10'>
          {/* BRAND COLUMN */}
          <div className='flex flex-col items-center md:items-start text-center md:text-left md:col-span-2 lg:col-span-1 gap-4'>
            {/* Logo + Brand Text */}
            <Link
              href='/'
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
                  height={40}
                  sizeContext='logo'
                  objectFit='contain'
                  className='h-10 w-auto'
                  sizes='40px'
                />
              )}
              {/* Brand Text - Image from CMS or fallback to organization name */}
              <div className='flex items-center'>
                {brandTextImage?.asset ? (
                  <UnifiedImage
                    src={brandTextImage}
                    alt={brandTextImage.alt || organizationName}
                    mode='sized'
                    width={300}
                    height={40}
                    sizeContext='full'
                    objectFit='contain'
                    className='max-h-10 max-w-full sm:max-w-100'
                    style={{ width: 'auto', height: 'auto' }}
                  />
                ) : (
                  <span className='text-h3 text-brand-primary'>{organizationName}</span>
                )}
              </div>
            </Link>

            {/* Footer Messages (tagline) */}
            {footerMessages && footerMessages.length > 0 && (
              <div className='space-y-3'>
                {footerMessages.map((message) => (
                  <div key={message._key}>
                    {message.title && (
                      <div className='font-bold text-body-sm text-gray-400'>{message.title}</div>
                    )}
                    {message.message && (
                      <div className='text-gray-400 text-body-sm'>{message.message}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Social Icons */}
            {transformedLinks.length > 0 && (
              <div
                className='flex gap-4 mt-1'
                {...createSanityDataAttribute('companyLinks', 'companyLinks', 'companyLinks')}>
                {transformedLinks.map((link) => (
                  <Link
                    key={link._key}
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={link.label}
                    title={link.label}
                    className='text-brand-primary hover:text-brand-primary-hover transition-colors duration-200'
                    {...createSanityDataAttribute(
                      'companyLinks',
                      'companyLinks',
                      `companyLinks.socialLinksArray[_key=="${link._key}"]`,
                    )}>
                    <SocialIcon platform={link.platform} className='text-body-xl' />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CONTACT COLUMN */}
          <div className='text-center md:text-left'>
            <p className='text-h6 mb-5 text-brand-white'>Contact</p>
            <div className='flex flex-col items-center md:items-start gap-3'>
              {contactDetails.map((detail, index) => (
                <a
                  key={index}
                  href={detail.link}
                  className='flex items-center gap-3 text-gray-400 hover:text-brand-white transition-colors duration-200 text-body-sm'
                  target={detail.link.startsWith('http') ? '_blank' : undefined}
                  rel={detail.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  <span className='text-brand-primary'>{detail.icon}</span>
                  {detail.value}
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS COLUMN */}
          {quickLinks.length > 0 && (
            <div className='text-center md:text-left'>
              <p className='text-h6 mb-5 text-brand-white'>Quick Links</p>
              <div
                className='flex flex-col items-center md:items-start gap-3'
                {...createSanityDataAttribute('footer', 'footer', 'quickLinks')}>
                {quickLinks.map((link) => {
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

                  const shouldOpenInNewTab =
                    link.linkType === 'external' ||
                    (link.linkType === 'internal' && link.openInNewTab);

                  return (
                    <Link
                      key={link._key}
                      href={href}
                      target={shouldOpenInNewTab ? '_blank' : undefined}
                      rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
                      className='text-gray-400 hover:text-brand-white transition-colors duration-200 text-body-sm'
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
        </div>

        {/* BOTTOM ROW */}
        <div className='border-t border-[#2a2a2a] pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-3'>
            {/* Copyright */}
            {footerData?._type === 'footer' && footerData.copyrightText && (
              <p className='text-gray-400 text-body-xs'>{footerData.copyrightText}</p>
            )}

            {/* Legal Links */}
            <div className='flex flex-wrap justify-center gap-5'>
              {!legalPagesVisibilityData?.termsAndConditions?.hide && (
                <Link
                  href='/terms-and-conditions'
                  className='text-gray-400 hover:text-brand-white transition-colors duration-200 text-body-xs'>
                  Terms & Conditions
                </Link>
              )}
              {!legalPagesVisibilityData?.privacyPolicy?.hide && (
                <Link
                  href='/privacy-policy'
                  className='text-gray-400 hover:text-brand-white transition-colors duration-200 text-body-xs'>
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
