import { sanityFetch as liveSanityFetch } from '@/sanity/lib/live';
import { notFound } from 'next/navigation';
import {
  getHomePageHero,
  getHomePageSections,
  getPageBuilderData,
  getFaqPage,
  getPrivacyPolicy,
  getTermsAndConditions,
  getPageBySlug,
} from '@/actions';
import HomePageContent from '@/components/pages/HomePageContent';
import FaqPageContent from '@/components/pages/FaqPageContent';
import LegalPageContent from '@/components/pages/LegalPageContent';
import SlugPageContent from '@/components/pages/SlugPageContent';

export default async function DraftCatchAllPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const route = '/' + (path?.join('/') || '');

  switch (route) {
    case '/': {
      const [hero, sections, pageBuilderData] = await Promise.all([
        getHomePageHero(liveSanityFetch),
        getHomePageSections(liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      return <HomePageContent hero={hero} sections={sections} pageBuilderData={pageBuilderData} />;
    }

    case '/faq': {
      const [faqData, pageBuilderData] = await Promise.all([
        getFaqPage(liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      return <FaqPageContent faqData={faqData} pageBuilderData={pageBuilderData} />;
    }

    case '/privacy-policy': {
      const [privacyData, pageBuilderData] = await Promise.all([
        getPrivacyPolicy(liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      return (
        <LegalPageContent
          legalData={privacyData}
          pageBuilderData={pageBuilderData}
          defaultTitle='Privacy Policy'
          urlPath='/privacy-policy'
          contactQuestionText='this Privacy Policy'
        />
      );
    }

    case '/terms-and-conditions': {
      const [termsData, pageBuilderData] = await Promise.all([
        getTermsAndConditions(liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      return (
        <LegalPageContent
          legalData={termsData}
          pageBuilderData={pageBuilderData}
          defaultTitle='Terms &amp; Conditions'
          urlPath='/terms-and-conditions'
          contactQuestionText='these Terms &amp; Conditions'
        />
      );
    }

    default: {
      // Dynamic slug pages
      const slug = path?.[0];
      if (!slug || (path && path.length > 1)) notFound();
      const [page, pageBuilderData] = await Promise.all([
        getPageBySlug(slug, liveSanityFetch),
        getPageBuilderData(liveSanityFetch),
      ]);
      return (
        <SlugPageContent
          page={page}
          pageBuilderData={pageBuilderData}
          slugPath={slug}
          isNestedPath={false}
        />
      );
    }
  }
}
