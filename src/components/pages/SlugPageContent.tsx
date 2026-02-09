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
import { urlFor } from '@/sanity/lib/image';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { getOrganizationName } from '@/lib/organizationInfo';
import type { PAGE_QUERY_RESULT } from '@/sanity/types';
import type { PageBuilderData } from '@/actions';

interface SlugPageContentProps {
  page: PAGE_QUERY_RESULT | null;
  pageBuilderData: PageBuilderData;
  slugPath: string;
  /** If slug has more than 1 segment, trigger 404 */
  isNestedPath: boolean;
}

const SlugPageContent = ({ page, pageBuilderData, slugPath, isNestedPath }: SlugPageContentProps) => {
  // For nested paths (e.g., /about/team), or if page not found, trigger 404
  if (!page || isNestedPath) {
    notFound();
  }

  const { seoMetaData, businessContactInfo } = pageBuilderData;

  const baseUrl = getBaseUrl();

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: page.title || 'Page', url: `${baseUrl}/${slugPath}` },
  ];

  // Generate Article structured data
  let articleSchema;
  if (seoMetaData && page._createdAt && page._updatedAt) {
    const organizationData = getOrganizationDataFromSeoMetaData(seoMetaData, baseUrl, null, businessContactInfo);

    articleSchema = generateArticleSchema({
      headline: page.title || 'Page',
      description: page.subtitle || undefined,
      image: page.heroImage ? urlFor(page.heroImage).width(1200).height(630).url() : undefined,
      datePublished: page._createdAt,
      dateModified: page._updatedAt,
      author: {
        name: seoMetaData.siteTitle || getOrganizationName(businessContactInfo),
        type: 'Organization',
      },
      publisher: organizationData,
      url: `${baseUrl}/${slugPath}`,
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
        title={page.title || 'Untitled Page'}
        subtTitle={page.subtitle || null}
        documentId={page._id}
        documentType={page._type}
      />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={page.title || 'Untitled Page'} />

      <Container>
        {/* Page Content */}
        {page.content && (
          <PageBuilder
            content={page.content}
            documentId={page._id}
            documentType={page._type}
            pageBuilderData={pageBuilderData}
          />
        )}
      </Container>
    </>
  );
};

export default SlugPageContent;
