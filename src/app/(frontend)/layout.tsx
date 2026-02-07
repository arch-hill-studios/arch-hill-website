import React from 'react';
import '../globals.css';
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

export async function generateMetadata() {
  const [seoMetaData, businessContactInfo] = await Promise.all([
    getSeoMetaData(),
    getBusinessContactInfo(),
  ]);

  const orgName = getOrganizationName(businessContactInfo);
  const orgDescription = getOrganizationDescription(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: `${orgName} | ${orgDescription}`,
      description: `Welcome to ${orgName}`,
    };
  }

  return generateDefaultMetadata({
    seoMetaData,
    businessContactInfo,
    image: seoMetaData.defaultOgImage, // Set default OG image at layout level
  });
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
