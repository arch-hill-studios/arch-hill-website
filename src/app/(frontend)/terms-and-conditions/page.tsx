import { getTermsAndConditions, getPageBuilderData } from '@/actions';
import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
} from '@/lib/metadata';
import { getOrganizationName } from '@/lib/organizationInfo';
import LegalPageContent from '@/components/pages/LegalPageContent';

export async function generateMetadata() {
  const [pageBuilderData, termsData] = await Promise.all([
    getPageBuilderData(),
    getTermsAndConditions(),
  ]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: `Terms & Conditions | ${orgName}`,
      description: 'Terms and conditions for using my website and services',
    };
  }

  const title = termsData?.title || 'Terms & Conditions';

  return generatePageMetadata({
    title,
    description:
      seoMetaData.siteDescription || 'Terms and conditions for using my website and services',
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/terms-and-conditions'),
  });
}

const TermsAndConditionsPage = async () => {
  const [termsData, pageBuilderData] = await Promise.all([
    getTermsAndConditions(),
    getPageBuilderData(),
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
};

export default TermsAndConditionsPage;
