import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import NavigationScroll from '@/components/NavigationScroll';
import PageReadyTrigger from '@/components/PageReadyTrigger';
import { PageLoadProvider } from '@/contexts/PageLoadContext';
import { HeaderProvider } from '@/contexts/HeaderContext';
import { ColorProvider } from '@/contexts/ColorContext'; // TEMPORARY_DEV: Color switching for testing
import { HeroStyleProvider } from '@/contexts/HeroStyleContext'; // TEMPORARY_DEV: Hero style switching for testing
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  getOrganizationDataFromSeoMetaData,
  getWebSiteDataFromSeoMetaData,
  getLocalBusinessDataFromSeoMetaData,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import { SITE_CONFIG } from '@/lib/constants';
import { getOrganizationName } from '@/lib/organizationInfo';
import type { HEADER_QUERYResult, FOOTER_QUERYResult, SEO_META_DATA_QUERYResult, BUSINESS_CONTACT_INFO_QUERYResult, COMPANY_LINKS_QUERYResult, LEGAL_PAGES_VISIBILITY_QUERYResult } from '@/sanity/types';

interface BaseLayoutProps {
  children: React.ReactNode;
  headerData: HEADER_QUERYResult | null;
  footerData: FOOTER_QUERYResult | null;
  seoMetaDataResult: SEO_META_DATA_QUERYResult | null;
  businessContactInfoData: BUSINESS_CONTACT_INFO_QUERYResult | null;
  companyLinksData: COMPANY_LINKS_QUERYResult | null;
  legalPagesVisibilityData: LEGAL_PAGES_VISIBILITY_QUERYResult | null;
  /** Optional slot for draft mode components (SanityLive, VisualEditing, DisableDraftMode) */
  draftModeSlot?: React.ReactNode;
}

const BaseLayout = ({
  children,
  headerData,
  footerData,
  seoMetaDataResult,
  businessContactInfoData,
  companyLinksData,
  legalPagesVisibilityData,
  draftModeSlot,
}: BaseLayoutProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_CONFIG.PRODUCTION_DOMAIN;

  // Get organization name for passing to client components
  const orgName = getOrganizationName(businessContactInfoData);

  // Generate structured data if SEO meta data is available
  let organizationSchema;
  let webSiteSchema;
  let localBusinessSchema;

  if (seoMetaDataResult) {
    const organizationData = getOrganizationDataFromSeoMetaData(
      seoMetaDataResult,
      baseUrl,
      companyLinksData,
      businessContactInfoData
    );
    const webSiteData = getWebSiteDataFromSeoMetaData(seoMetaDataResult, baseUrl, businessContactInfoData);
    const localBusinessData = getLocalBusinessDataFromSeoMetaData(
      seoMetaDataResult,
      baseUrl,
      companyLinksData,
      businessContactInfoData
    );

    organizationSchema = generateOrganizationSchema(organizationData);
    webSiteSchema = generateWebSiteSchema(webSiteData);
    localBusinessSchema = generateLocalBusinessSchema(localBusinessData);
  }

  return (
    <ColorProvider>
      <HeroStyleProvider>
        <PageLoadProvider>
          <HeaderProvider>
            <NavigationScroll />
            <PageReadyTrigger />

            {/* Structured Data */}
            {organizationSchema && (
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={generateStructuredDataScript(organizationSchema)}
              />
            )}
            {webSiteSchema && (
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={generateStructuredDataScript(webSiteSchema)}
              />
            )}
            {localBusinessSchema && (
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={generateStructuredDataScript(localBusinessSchema)}
              />
            )}

            <div className='min-h-screen flex flex-col'>
              <Header headerData={headerData} organizationName={orgName} businessContactInfo={businessContactInfoData} />
              <main id='main-content' className='flex-1 min-h-screen'>
                {children}
              </main>
              <Footer
                footerData={footerData}
                companyLinksData={companyLinksData}
                legalPagesVisibilityData={legalPagesVisibilityData}
                organizationName={orgName}
                businessContactInfo={businessContactInfoData}
              />
              {draftModeSlot}
            </div>
          </HeaderProvider>
        </PageLoadProvider>
      </HeroStyleProvider>
    </ColorProvider>
  );
};

export default BaseLayout;
