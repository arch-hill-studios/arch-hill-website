import MaintenancePage from '@/components/MaintenancePage/MaintenancePage';
import type { Metadata } from 'next';
import { fetchOrganizationName, getOrganizationName } from '@/lib/organizationInfo';
import { getBusinessContactInfo } from '@/actions';

export async function generateMetadata(): Promise<Metadata> {
  const orgName = await fetchOrganizationName();

  return {
    title: `${orgName} | Coming Soon`,
    description: 'New website on its way. Check back soon!',
    openGraph: {
      title: `${orgName} - Coming Soon`,
      description: 'New website on its way. Check back soon!',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: orgName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${orgName} | Coming Soon`,
      description: 'New website on its way. Check back soon!',
      images: ['/images/og-image.png'],
    },
  };
}

const MaintenanceModePage = async () => {
  const businessContactInfo = await getBusinessContactInfo();
  const orgName = getOrganizationName(businessContactInfo);

  return <MaintenancePage organizationName={orgName} businessContactInfo={businessContactInfo} />;
};

export default MaintenanceModePage;
