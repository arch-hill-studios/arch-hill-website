import React from 'react';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import { getBaseUrl } from '@/lib/metadata';
import { generateArticleSchema, generateStructuredDataScript } from '@/lib/structuredData';
import BreadcrumbStructuredData from '@/components/StructuredData/BreadcrumbStructuredData';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { MdEmail, MdPhone, MdMessage } from 'react-icons/md';
import ContactForm from '@/components/Forms/ContactForm/ContactForm';
import {
  getOrganizationName,
  getOrganizationEmail,
  getOrganizationEmailLink,
  getOrganizationPhone,
  getOrganizationPhoneLink,
  getLogo,
} from '@/lib/organizationInfo';
import { urlFor } from '@/sanity/lib/image';
import CardLight from '@/components/UI/CardLight';
import ExpandingContentWrapper from '@/components/UI/ExpandingContentWrapper';
import { maxCardWidth } from '@/utils/spacingConstants';
import CardGradient from '@/components/UI/CardGradient';
import type { CONTACT_GENERAL_CONTENT_QUERYResult, CONTACT_FORM_SETTINGS_QUERYResult } from '@/sanity/types';
import type { PageBuilderData } from '@/actions';

interface ContactPageContentProps {
  contactPageData: CONTACT_GENERAL_CONTENT_QUERYResult;
  contactFormSettings: CONTACT_FORM_SETTINGS_QUERYResult;
  pageBuilderData: PageBuilderData;
}

const ContactPageContent = ({ contactPageData, contactFormSettings, pageBuilderData }: ContactPageContentProps) => {
  const baseUrl = getBaseUrl();

  const { businessContactInfo } = pageBuilderData;
  const logo = getLogo(businessContactInfo);
  const logoUrl = logo?.asset ? urlFor(logo).width(512).height(512).url() : undefined;
  const orgName = getOrganizationName(businessContactInfo);
  const email = getOrganizationEmail(businessContactInfo);
  const emailLink = getOrganizationEmailLink(businessContactInfo);
  const phone = getOrganizationPhone(businessContactInfo);
  const phoneLink = getOrganizationPhoneLink(businessContactInfo);

  // Fallback values if Sanity data is not available
  const pageTitle = contactPageData?.title || 'Contact Me';
  const pageSubtitle =
    contactPageData?.subtitle ||
    'Get in touch for general enquiries or start your coaching journey';

  // Introduction text
  const introduction =
    contactPageData?.introduction ||
    "Have a question or want to learn more about my coaching services? Get in touch using any method below and I'll get back to you as soon as possible.";

  // Contact card titles
  const emailTitle = contactPageData?.emailTitle || 'Email me';
  const phoneTitle = contactPageData?.phoneTitle || 'Call me';

  // Contact form card data
  const formTitle = contactFormSettings?.formTitle || 'Send me a message';
  const formSubtitle =
    contactFormSettings?.formSubtitle || 'Submit your enquiry using my contact form.';

  // Closing card data
  const closingCardTitle =
    contactPageData?.closingCardTitle || 'Ready to start your coaching journey?';
  const closingCardBody =
    contactPageData?.closingCardBody ||
    "If you're ready to commit to your fitness goals and want to begin coaching right away, submit a full application instead.";
  const closingCardCtaText = contactPageData?.closingCardCtaText || 'Apply for Coaching';

  // Compute the closing card href
  let closingCardHref = '/apply'; // default fallback
  if (contactPageData?.linkType === 'external' && contactPageData?.externalUrl) {
    closingCardHref = contactPageData.externalUrl;
  } else if (contactPageData?.linkType === 'internal') {
    const internalHref = contactPageData?.internalLink?.href || '/';
    const sectionId = contactPageData?.pageSectionId;
    closingCardHref = sectionId ? `${internalHref}#${sectionId}` : internalHref;
  }

  // Generate breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: pageTitle, url: `${baseUrl}/contact` },
  ];

  // Generate Article structured data using actual Sanity dates
  const articleSchema = generateArticleSchema({
    headline: pageTitle,
    description: pageSubtitle,
    datePublished: contactPageData?._createdAt || new Date().toISOString(),
    dateModified: contactPageData?._updatedAt || new Date().toISOString(),
    author: {
      name: orgName,
      type: 'Organization',
    },
    publisher: {
      name: orgName,
      url: baseUrl,
      ...(logoUrl && { logo: logoUrl }),
    },
    url: `${baseUrl}/contact`,
  });

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      {articleSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={generateStructuredDataScript(articleSchema)}
        />
      )}

      {/* Page Hero */}
      <PageHero title={pageTitle} subtTitle={pageSubtitle} />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle={pageTitle} />

      <Container textAlign='center'>
        {/* Introduction */}
        <div className='max-w-3xl mx-auto mb-12'>
          <p className='text-body-lg'>{introduction}</p>
        </div>

        {/* Contact Methods */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto mb-16 ${maxCardWidth}`}>
          {/* Contact Form */}
          <CardLight
            id='contact-form'
            showBorder
            className='md:col-span-2'
            title={formTitle}
            icon={MdMessage}>
            <p className='mb-4'>{formSubtitle}</p>

            <ExpandingContentWrapper
              expandLabel='Show Contact Form'
              collapseLabel='Hide Contact Form'
              showOnDesktop={true}
              alwaysCentered={true}>
              <ContactForm className='py-8' settings={contactFormSettings} />
            </ExpandingContentWrapper>
          </CardLight>

          {/* Email */}
          {email && (
            <CardLight title={emailTitle} icon={MdEmail}>
              <a
                href={emailLink}
                className='text-body-base hover:text-brand-secondary transition-colors'>
                {email}
              </a>
            </CardLight>
          )}

          {/* Phone */}
          {phone && (
            <CardLight title={phoneTitle} icon={MdPhone}>
              <a
                href={phoneLink}
                className='text-body-base hover:text-brand-secondary transition-colors'>
                {phone}
              </a>
            </CardLight>
          )}
        </div>

        {/* Ready to Apply CTA */}
        <CardGradient
          title={closingCardTitle}
          body={closingCardBody}
          ctaText={closingCardCtaText}
          ctaHref={closingCardHref}
        />
      </Container>
    </>
  );
};

export default ContactPageContent;
