import React from 'react';
import Link from 'next/link';
import { SocialIcon, type SocialPlatform, getPlatformLabel } from '@/utils/socialIcons';
import { cleanPlatform } from '@/utils/cleanPlatform';
import { createDataAttribute } from 'next-sanity';
import { createDataAttributeConfig } from '@/components/PageBuilder';
import { detectPlatformFromUrl } from '@/sanity/schemaTypes/shared/platformsConfig';

interface SocialLinkItem {
  _key: string;
  platform?: string | null;
  url: string | null;
  customTitle?: string | null;
  hideFromFooter?: boolean | null;
}

interface CompanyLinksData {
  _type?: string;
  socialLinksArray?: SocialLinkItem[] | null;
}

interface CompanyLinksBlockProps {
  companyLinks?: CompanyLinksData | null;
}

const CompanyLinksBlock: React.FC<CompanyLinksBlockProps> = ({ companyLinks }) => {
  if (!companyLinks?.socialLinksArray) return null;

  // Filter for valid links and get final platform (detected or manual)
  const socialLinks = companyLinks.socialLinksArray.filter((link) => {
    if (!link.url) return false;

    // Get final platform from auto-detection or manual selection
    const detected = detectPlatformFromUrl(link.url);
    const finalPlatform = detected?.key || link.platform;

    return finalPlatform && typeof finalPlatform === 'string' && finalPlatform.trim() !== '';
  });

  // If no links exist, don't render anything
  if (socialLinks.length === 0) {
    return null;
  }

  // Transform to display format with final platform values
  const allLinks = socialLinks.map((link) => {
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

  return (
    <div className='w-full'>
      <div
        className='flex flex-wrap justify-center gap-4'
        data-sanity={createDataAttribute({
          ...createDataAttributeConfig,
          id: 'companyLinks',
          type: 'companyLinks',
          path: 'companyLinks',
        }).toString()}>
        {allLinks.map((link, index) => {
          // Create data attribute for individual social link item
          const dataAttribute = createDataAttribute({
            ...createDataAttributeConfig,
            id: 'companyLinks',
            type: 'companyLinks',
            path: `companyLinks.socialLinksArray[_key=="${link._key}"]`,
          }).toString();

          return (
            <Link
              key={link._key || `${link.platform}-${index}`}
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex flex-col items-center gap-3 shadow-sm border border-gray-200 px-1 py-4 rounded-2xl bg-brand-white transition-all duration-200 hover:scale-105 shrink-0 w-[95px]'
              data-sanity={dataAttribute}>
              {/* Icon Circle */}
              <div className='w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center'>
                <SocialIcon
                  platform={link.platform}
                  className='text-black text-body-4xl md:text-body-3xl transition-transform duration-200 group-hover:scale-110'
                />
              </div>

              {/* Label */}
              <span className='text-body-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 text-center leading-tight wrap-break-word hyphens-auto'>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyLinksBlock;
