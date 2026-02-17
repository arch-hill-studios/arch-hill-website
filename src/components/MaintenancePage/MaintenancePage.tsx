import UnifiedImage from '@/components/UI/UnifiedImage';
import type { BUSINESS_CONTACT_INFO_QUERY_RESULT } from '@/sanity/types';
import {
  getBrandTextImage,
  getOrganizationEmail,
  getOrganizationEmailLink,
  getOrganizationPhone,
  getOrganizationPhoneLink,
} from '@/lib/organizationInfo';

interface MaintenancePageProps {
  organizationName: string;
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
}

const MaintenancePage = ({ organizationName, businessContactInfo }: MaintenancePageProps) => {
  const brandTextImage = getBrandTextImage(businessContactInfo);
  const email = getOrganizationEmail(businessContactInfo);
  const emailLink = getOrganizationEmailLink(businessContactInfo);
  const phone = getOrganizationPhone(businessContactInfo);
  const phoneLink = getOrganizationPhoneLink(businessContactInfo);

  const hasBrandTextImage = brandTextImage?.asset;

  return (
    <div className='min-h-svh flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full text-center space-y-8'>
        {/* Brand Text Image */}
        {<h1 className='sr-only'>{organizationName}</h1>}
        {hasBrandTextImage && (
          <div className='mb-6'>
            <UnifiedImage
              src={brandTextImage}
              alt={organizationName}
              mode='sized'
              width={900}
              height={200}
              sizeContext='hero'
              objectFit='contain'
              className='w-full h-auto mx-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]'
              priority
            />
          </div>
        )}

        {/* Coming Soon Message - Placeholder for now */}
        <div className='space-y-4'>
          <h2 className='text-h4 text-brand-primary font-bold'>Coming Soon</h2>
          <p className='text-brand-muted'>New website on its way ...</p>
        </div>

        {/* Contact Information */}
        {(email || phone) && (
          <div className='space-y-3 pt-8 border-t border-brand-white/20'>
            <p className='text-body-lg text-brand-white/80 font-semibold'>
              For all enquiries, please get in contact:
            </p>
            <div className='space-y-2 text-body-base text-brand-white/80'>
              {email && (
                <p>
                  <a
                    href={emailLink}
                    className='hover:text-brand-white transition-colors underline'>
                    {email}
                  </a>
                </p>
              )}
              {phone && (
                <p>
                  <a
                    href={phoneLink}
                    className='hover:text-brand-white transition-colors underline'>
                    {phone}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
