import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import NavigationScroll from '@/components/NavigationScroll';
import PageReadyTrigger from '@/components/PageReadyTrigger';
import { PageLoadProvider } from '@/contexts/PageLoadContext';
import { HeaderProvider } from '@/contexts/HeaderContext';
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
import type { HEADER_QUERY_RESULT, FOOTER_QUERY_RESULT, SEO_META_DATA_QUERY_RESULT, BUSINESS_CONTACT_INFO_QUERY_RESULT, COMPANY_LINKS_QUERY_RESULT, LEGAL_PAGES_VISIBILITY_QUERY_RESULT } from '@/sanity/types';

interface BaseLayoutProps {
  children: React.ReactNode;
  headerData: HEADER_QUERY_RESULT | null;
  footerData: FOOTER_QUERY_RESULT | null;
  seoMetaDataResult: SEO_META_DATA_QUERY_RESULT | null;
  businessContactInfoData: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
  companyLinksData: COMPANY_LINKS_QUERY_RESULT | null;
  legalPagesVisibilityData: LEGAL_PAGES_VISIBILITY_QUERY_RESULT | null;
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
  );
};

export default BaseLayout;
