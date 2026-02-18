import { getPrivacyPolicy, getPageBuilderData } from '@/actions';
import { generateMetadata as generatePageMetadata, generateCanonicalUrl } from '@/lib/metadata';
import { getOrganizationName } from '@/lib/organizationInfo';
import LegalPageContent from '@/components/pages/LegalPageContent';

export async function generateMetadata() {
  const [pageBuilderData, privacyData] = await Promise.all([
    getPageBuilderData(),
    getPrivacyPolicy(),
  ]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);

  const pageDescription = 'Privacy policy for our website and how we handle your data';

  if (!seoMetaData) {
    return {
      title: `Privacy Policy | ${orgName}`,
      description: pageDescription,
    };
  }

  const title = privacyData?.title || 'Privacy Policy';

  return generatePageMetadata({
    title,
    description: pageDescription,
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/privacy-policy'),
  });
}

const PrivacyPolicyPage = async () => {
  const [privacyData, pageBuilderData] = await Promise.all([
    getPrivacyPolicy(),
    getPageBuilderData(),
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
};

export default PrivacyPolicyPage;
