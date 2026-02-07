import React from 'react';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import { getBaseUrl } from '@/lib/metadata';
import {
  generateArticleSchema,
  getOrganizationDataFromSeoMetaData,
  generateStructuredDataScript,
} from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import Breadcrumb from '@/components/UI/Breadcrumb';
import {
  getOrganizationName,
  getOrganizationEmail,
  getOrganizationEmailLink,
  getOrganizationPhone,
  getOrganizationPhoneLink,
} from '@/lib/organizationInfo';
import PageSection from '@/components/Layout/PageSection';
import type { PRIVACY_POLICY_QUERYResult, TERMS_AND_CONDITIONS_QUERYResult, PAGE_QUERYResult } from '@/sanity/types';
import type { PageBuilderData } from '@/actions';

type LegalData = NonNullable<PRIVACY_POLICY_QUERYResult> | NonNullable<TERMS_AND_CONDITIONS_QUERYResult>;

interface LegalPageContentProps {
  legalData: LegalData | null;
  pageBuilderData: PageBuilderData;
  defaultTitle: string;
  urlPath: string;
  contactQuestionText: string;
}

const LegalPageContent = ({ legalData, pageBuilderData, defaultTitle, urlPath, contactQuestionText }: LegalPageContentProps) => {
  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);
  const email = getOrganizationEmail(businessContactInfo);
  const emailLink = getOrganizationEmailLink(businessContactInfo);
  const phone = getOrganizationPhone(businessContactInfo);
  const phoneLink = getOrganizationPhoneLink(businessContactInfo);

  // If the page is hidden or doesn't exist, show 404
  if (!legalData || legalData.hide) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: legalData.title || defaultTitle, url: `${baseUrl}${urlPath}` },
  ];

  // Generate Article structured data
  let articleSchema;
  if (seoMetaData && legalData._updatedAt) {
    const organizationData = getOrganizationDataFromSeoMetaData(seoMetaData, baseUrl, null, businessContactInfo);

    articleSchema = generateArticleSchema({
      headline: legalData.title || defaultTitle,
      description: seoMetaData.siteDescription || undefined,
      datePublished: legalData._updatedAt,
      dateModified: legalData._updatedAt,
      author: {
        name: seoMetaData.siteTitle || orgName,
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}${urlPath}`,
    });
  }

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {articleSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(articleSchema)}
        />
      )}

      {/* Page Hero */}
      <PageHero
        title={legalData.title || defaultTitle}
        documentId={legalData._id}
        documentType={legalData._type}
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={legalData.title || defaultTitle} />

      <Container textAlign='left'>
        {/* Page Content */}
        {legalData.topText && <p className='font-bold mb-8'>{legalData.topText}</p>}
        {legalData.content && (
          <PageBuilder
            content={legalData.content as NonNullable<PAGE_QUERYResult>['content']}
            documentId={legalData._id}
            documentType={legalData._type}
            pageBuilderData={pageBuilderData}
            alignment='left'
          />
        )}
        {/* Contact Information Section */}
        {(email || phone) && (
          <PageSection title='Contact Information'>
            <div className='space-y-4'>
              <p>If you have questions about {contactQuestionText}, please contact me:</p>
              {email && (
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={emailLink} className='text-brand-primary hover:underline'>
                    {email}
                  </a>
                </p>
              )}
              {phone && (
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href={phoneLink} className='text-brand-primary hover:underline'>
                    {phone}
                  </a>
                </p>
              )}
            </div>
          </PageSection>
        )}
      </Container>
    </>
  );
};

export default LegalPageContent;
