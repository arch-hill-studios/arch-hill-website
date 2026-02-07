import {
  getFaqPage,
  getPageBuilderData,
} from '@/actions';
import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
} from '@/lib/metadata';
import { getOrganizationName } from '@/lib/organizationInfo';
import FaqPageContent from '@/components/pages/FaqPageContent';

export async function generateMetadata() {
  const [pageBuilderData, faqData] = await Promise.all([getPageBuilderData(), getFaqPage()]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: `FAQ | ${orgName}`,
      description: 'Frequently asked questions about my services',
    };
  }

  const title = faqData?.title || 'FAQ';
  const description = faqData?.subtitle || seoMetaData.siteDescription || 'Frequently asked questions about my services';

  return generatePageMetadata({
    title,
    description,
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/faq'),
  });
}

const FAQPage = async () => {
  const [faqData, pageBuilderData] = await Promise.all([
    getFaqPage(),
    getPageBuilderData(),
  ]);

  return (
    <FaqPageContent
      faqData={faqData}
      pageBuilderData={pageBuilderData}
    />
  );
};

export default FAQPage;
