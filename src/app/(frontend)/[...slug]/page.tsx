import { getPageBySlug, getPageBuilderData, getAllPages } from '@/actions';
import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
} from '@/lib/metadata';
import { getOrganizationName, getOrganizationDescription } from '@/lib/organizationInfo';
import SlugPageContent from '@/components/pages/SlugPageContent';

export async function generateStaticParams() {
  const pages = await getAllPages();
  if (!pages || !Array.isArray(pages)) return [];

  return (pages as Array<{ slug?: { current?: string } }>)
    .filter((page) => page.slug?.current)
    .map((page) => ({
      slug: [page.slug!.current!],
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  // Join slug array to create the full path (e.g., ['about', 'team'] -> 'about/team')
  // For single segments, this is just the slug itself
  const slugPath = slug.join('/');
  // For Sanity query, we only use the first segment (top-level pages)
  const pageSlug = slug[0];

  const [pageBuilderData, page] = await Promise.all([getPageBuilderData(), getPageBySlug(pageSlug)]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;
  const orgName = getOrganizationName(businessContactInfo);
  const orgDescription = getOrganizationDescription(businessContactInfo);

  if (!seoMetaData) {
    return {
      title: orgName,
      description: orgDescription,
    };
  }

  // For nested paths (e.g., /about/team), or if page not found, show 404 metadata
  if (!page || slug.length > 1) {
    return {
      title: `Page Not Found | ${orgName}`,
      description: 'The page you are looking for could not be found.',
    };
  }

  return generatePageMetadata({
    title: page.title || undefined,
    description: page.subtitle || seoMetaData.siteDescription || undefined,
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl(`/${slugPath}`),
  });
}

const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const pageSlug = slug[0];

  const [page, pageBuilderData] = await Promise.all([
    getPageBySlug(pageSlug),
    getPageBuilderData(),
  ]);

  return (
    <SlugPageContent
      page={page}
      pageBuilderData={pageBuilderData}
      slugPath={slugPath}
      isNestedPath={slug.length > 1}
    />
  );
};

export default Page;
