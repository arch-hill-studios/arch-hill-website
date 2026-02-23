import MaintenancePage from '@/components/MaintenancePage/MaintenancePage';
import type { Metadata } from 'next';
import { getOrganizationName } from '@/lib/organizationInfo';
import { getBusinessContactInfo, getSeoMetaData } from '@/actions';
import { urlFor } from '@/sanity/lib/image';
import { getBaseUrl } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [businessContactInfo, seoMetaData] = await Promise.all([
    getBusinessContactInfo(),
    getSeoMetaData(),
  ]);

  const orgName = getOrganizationName(businessContactInfo);

  // Favicon icons from Sanity (with fallback to static files)
  const favicon = businessContactInfo?.favicon;
  const faviconIcons = favicon?.asset?._ref
    ? {
        icon: [
          { url: urlFor(favicon).size(32, 32).format('png').url(), sizes: '32x32', type: 'image/png' },
          { url: urlFor(favicon).size(16, 16).format('png').url(), sizes: '16x16', type: 'image/png' },
        ],
        apple: [
          { url: urlFor(favicon).size(180, 180).format('png').url(), sizes: '180x180', type: 'image/png' },
        ],
      }
    : {
        icon: [{ url: '/images/favicons/icon.png', sizes: '32x32', type: 'image/png' }],
        apple: [{ url: '/images/favicons/apple-icon.png', sizes: '180x180', type: 'image/png' }],
      };

  // OG image from Sanity (with fallback to static file)
  let ogImageUrl: string;
  let ogImageAlt: string;

  if (seoMetaData?.defaultOgImage?.asset?._ref) {
    // Use default OG image from Sanity
    ogImageUrl = urlFor(seoMetaData.defaultOgImage).width(1200).height(630).url();
    ogImageAlt = seoMetaData.defaultOgImage.alt || `${orgName} - Coming Soon`;
  } else {
    // Fallback to static OG image
    ogImageUrl = `${getBaseUrl()}/images/og-image.png`;
    ogImageAlt = `${orgName} - Coming Soon`;
  }

  return {
    title: `${orgName} | Coming Soon`,
    description: 'New website on its way. Check back soon!',
    icons: faviconIcons,
    openGraph: {
      title: `${orgName} - Coming Soon`,
      description: 'New website on its way. Check back soon!',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${orgName} | Coming Soon`,
      description: 'New website on its way. Check back soon!',
      images: [
        {
          url: ogImageUrl,
          alt: ogImageAlt,
        },
      ],
    },
  };
}

const MaintenanceModePage = async () => {
  const businessContactInfo = await getBusinessContactInfo();
  const orgName = getOrganizationName(businessContactInfo);

  return <MaintenancePage organizationName={orgName} businessContactInfo={businessContactInfo} />;
};

export default MaintenanceModePage;
