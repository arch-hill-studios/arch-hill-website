import React from 'react';
import { notFound } from 'next/navigation';
import PageBuilder from '@/components/PageBuilder';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import { getBaseUrl } from '@/lib/metadata';
import {
  generateArticleSchema,
  generateFAQPageSchema,
  getOrganizationDataFromSeoMetaData,
  generateStructuredDataScript,
  FAQItem,
} from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { getOrganizationName } from '@/lib/organizationInfo';
import type { FAQ_PAGE_QUERYResult } from '@/sanity/types';
import type { PageBuilderData } from '@/actions';

interface FaqPageContentProps {
  faqData: FAQ_PAGE_QUERYResult;
  pageBuilderData: PageBuilderData;
}

/**
 * Recursively extracts FAQ items from page content.
 * Searches through all content blocks including nested structures.
 */
function extractFAQItemsFromContent(content: unknown[]): FAQItem[] {
  const faqItems: FAQItem[] = [];

  const processBlock = (block: unknown) => {
    if (!block || typeof block !== 'object') return;

    const typedBlock = block as { _type?: string; faqItems?: Array<{ question?: string; answer?: string }>; content?: unknown[] };

    // Check if this is an FAQ block
    if (typedBlock._type === 'faqBlock' && Array.isArray(typedBlock.faqItems)) {
      for (const item of typedBlock.faqItems) {
        if (item.question && item.answer) {
          faqItems.push({
            question: item.question,
            answer: item.answer,
          });
        }
      }
    }

    // Recursively process nested content
    if (Array.isArray(typedBlock.content)) {
      for (const nestedBlock of typedBlock.content) {
        processBlock(nestedBlock);
      }
    }
  };

  for (const block of content) {
    processBlock(block);
  }

  return faqItems;
}

const FaqPageContent = ({ faqData, pageBuilderData }: FaqPageContentProps) => {
  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);

  // If the page doesn't exist, show 404
  if (!faqData) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: faqData.title || 'FAQ', url: `${baseUrl}/faq` },
  ];

  // Extract FAQ items from page content for FAQPage schema
  const faqItems = faqData.content ? extractFAQItemsFromContent(faqData.content as unknown[]) : [];
  const faqPageSchema = generateFAQPageSchema(faqItems);

  // Generate Article structured data
  let articleSchema;
  if (seoMetaData && faqData._updatedAt) {
    const organizationData = getOrganizationDataFromSeoMetaData(seoMetaData, baseUrl, null, businessContactInfo);

    articleSchema = generateArticleSchema({
      headline: faqData.title || 'FAQ',
      description: faqData.subtitle || seoMetaData.siteDescription || undefined,
      datePublished: faqData._createdAt || faqData._updatedAt,
      dateModified: faqData._updatedAt,
      author: {
        name: seoMetaData.siteTitle || orgName,
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}/faq`,
    });
  }

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {faqPageSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(faqPageSchema)}
        />
      )}
      {articleSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(articleSchema)}
        />
      )}

      {/* Page Hero */}
      <PageHero
        title={faqData.title || 'FAQ'}
        subtTitle={faqData.subtitle}
        documentId={faqData._id}
        documentType={faqData._type}
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={faqData.title || 'FAQ'} />

      <Container textAlign='center'>
        {/* Page Content */}
        {faqData.content && (
          <PageBuilder
            content={faqData.content as NonNullable<import('@/sanity/types').PAGE_QUERYResult>['content']}
            documentId={faqData._id}
            documentType={faqData._type}
            pageBuilderData={pageBuilderData}
            alignment='center'
          />
        )}
      </Container>
    </>
  );
};

export default FaqPageContent;
