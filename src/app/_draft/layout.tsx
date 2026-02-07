import React from 'react';
import '../globals.css';
import { draftMode } from 'next/headers';
import { SanityLive, sanityFetch as liveSanityFetch } from '@/sanity/lib/live';
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

const DraftLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [headerData, footerData, seoMetaDataResult, businessContactInfoData, companyLinksData, legalPagesVisibilityData] = await Promise.all([
    getHeader(liveSanityFetch),
    getFooter(liveSanityFetch),
    getSeoMetaData(liveSanityFetch),
    getBusinessContactInfo(liveSanityFetch),
    getCompanyLinks(liveSanityFetch),
    getLegalPagesVisibility(liveSanityFetch),
  ]);

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

export default DraftLayout;
