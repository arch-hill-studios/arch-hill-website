import React from 'react';
import { draftMode } from 'next/headers';
import { SanityLive } from '@/sanity/lib/live';
import BaseLayout from '@/components/Layout/BaseLayout';
import DisableDraftMode from '@/components/DisableDraftMode';
import { VisualEditingProvider } from '@/components/VisualEditingProvider';
import {
  getHeader,
  getFooter,
  getSeoMetaData,
  getBusinessContactInfo,
  getCompanyLinks,
  getLegalPagesVisibility,
} from '@/actions';
import { generateMetadata as generateDefaultMetadata } from '@/lib/metadata';
import { getOrganizationName, getOrganizationDescription } from '@/lib/organizationInfo';
import { urlFor } from '@/sanity/lib/image';

export async function generateMetadata() {
  const [seoMetaData, businessContactInfo] = await Promise.all([
    getSeoMetaData(),
    getBusinessContactInfo(),
  ]);

  const orgName = getOrganizationName(businessContactInfo);
  const orgDescription = getOrganizationDescription(businessContactInfo);

  // Favicon icons — computed before the seoMetaData check so they're included in all return paths
  const favicon = businessContactInfo?.favicon;
  const faviconIcons = favicon?.asset?._ref
    ? {
        icon: [
          { url: urlFor(favicon).size(32, 32).format('png').url(), sizes: '32x32', type: 'image/png' },
          { url: urlFor(favicon).size(16, 16).format('png').url(), sizes: '16x16', type: 'image/png' },
        ],
        apple: [
          { url: urlFor(favicon).size(180, 180).format('png').url(), sizes: '180x180', type: 'image/png' },
        ],
      }
    : {
        icon: [{ url: '/images/favicons/icon.png', sizes: '32x32', type: 'image/png' }],
        apple: [{ url: '/images/favicons/apple-icon.png', sizes: '180x180', type: 'image/png' }],
      };

  if (!seoMetaData) {
    return {
      title: `${orgName} | ${orgDescription}`,
      description: `Welcome to ${orgName}`,
      icons: faviconIcons,
    };
  }

  const baseMetadata = generateDefaultMetadata({
    seoMetaData,
    businessContactInfo,
    image: seoMetaData.defaultOgImage, // Set default OG image at layout level
  });

  return {
    ...baseMetadata,
    icons: faviconIcons,
  };
}

const FrontendLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [headerData, footerData, seoMetaDataResult, businessContactInfoData, companyLinksData, legalPagesVisibilityData] = await Promise.all([
    getHeader(),
    getFooter(),
    getSeoMetaData(),
    getBusinessContactInfo(),
    getCompanyLinks(),
    getLegalPagesVisibility(),
  ]);

  // Draft mode components for Sanity Presentation Tool
  const draftModeSlot = (await draftMode()).isEnabled ? (
    <>
      <SanityLive />
      <VisualEditingProvider />
      <DisableDraftMode />
    </>
  ) : null;

  return (
    <BaseLayout
      headerData={headerData}
      footerData={footerData}
      seoMetaDataResult={seoMetaDataResult}
      businessContactInfoData={businessContactInfoData}
      companyLinksData={companyLinksData}
      legalPagesVisibilityData={legalPagesVisibilityData}
      draftModeSlot={draftModeSlot}
    >
      {children}
    </BaseLayout>
  );
};

export default FrontendLayout;
