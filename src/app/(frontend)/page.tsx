import { getHomePageHero, getHomePageSections, getPageBuilderData } from '@/actions';
import { generateMetadata as generatePageMetadata, generateCanonicalUrl } from '@/lib/metadata';
import { getOrganizationName, getOrganizationDescription } from '@/lib/organizationInfo';
import HomePageContent from '@/components/pages/HomePageContent';

export async function generateMetadata() {
  const pageBuilderData = await getPageBuilderData();
  const { seoMetaData, businessContactInfo } = pageBuilderData;

  const orgName = getOrganizationName(businessContactInfo);
  const orgDescription = getOrganizationDescription(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: orgName,
      description: orgDescription,
    };
  }

  return generatePageMetadata({
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/'),
  });
}

const Page = async () => {
  const [hero, sections, pageBuilderData] = await Promise.all([
    getHomePageHero(),
    getHomePageSections(),
    getPageBuilderData(),
  ]);

  return (
    <HomePageContent
      hero={hero}
      sections={sections}
      pageBuilderData={pageBuilderData}
    />
  );
};

export default Page;
