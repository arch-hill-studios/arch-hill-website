import {
  generateMetadata as generatePageMetadata,
  generateCanonicalUrl,
} from '@/lib/metadata';
import { getContactFormSettings, getContactGeneralContent, getPageBuilderData } from '@/actions';
import ContactPageContent from '@/components/pages/ContactPageContent';

export async function generateMetadata() {
  // Fetch contact page data and page builder data for metadata
  const [contactPageData, pageBuilderData] = await Promise.all([
    getContactGeneralContent(),
    getPageBuilderData(),
  ]);

  const { seoMetaData, businessContactInfo } = pageBuilderData;

  // Hard-coded fallback values (lowest priority)
  const fallbackTitle = 'Contact Me';
  const fallbackDescription = '';

  // Priority: Page-specific Sanity data > Hard-coded fallbacks
  const ogTitle = contactPageData?.title || fallbackTitle;
  const ogDescription = contactPageData?.subtitle || fallbackDescription;

  return generatePageMetadata({
    title: ogTitle,
    description: ogDescription,
    seoMetaData,
    businessContactInfo,
    canonicalUrl: generateCanonicalUrl('/contact'),
  });
}

const ContactPage = async () => {
  // Fetch contact page data, form settings, and page builder data from Sanity
  const [contactPageData, contactFormSettings, pageBuilderData] = await Promise.all([
    getContactGeneralContent(),
    getContactFormSettings(),
    getPageBuilderData(),
  ]);

  return (
    <ContactPageContent
      contactPageData={contactPageData}
      contactFormSettings={contactFormSettings}
      pageBuilderData={pageBuilderData}
    />
  );
};

export default ContactPage;
