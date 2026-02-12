import React from 'react';
import ContactForm from '@/components/Forms/ContactForm/ContactForm';
import ContactMap from './ContactMap';
import {
  getOrganizationEmail,
  getOrganizationEmailLink,
  getOrganizationPhone,
  getOrganizationPhoneLink,
  getOrganizationAddress,
  getOrganizationAddressLink,
  getGoogleMapsEmbedCode,
  getBusinessHours,
} from '@/lib/organizationInfo';
import type {
  BUSINESS_CONTACT_INFO_QUERY_RESULT,
  CONTACT_FORM_SETTINGS_QUERY_RESULT,
} from '@/sanity/types';

interface ContactSectionProps {
  businessContactInfo: BUSINESS_CONTACT_INFO_QUERY_RESULT | null;
  contactFormSettings: CONTACT_FORM_SETTINGS_QUERY_RESULT | null;
}

const ContactSection = ({ businessContactInfo, contactFormSettings }: ContactSectionProps) => {
  const email = getOrganizationEmail(businessContactInfo);
  const emailLink = getOrganizationEmailLink(businessContactInfo);
  const phone = getOrganizationPhone(businessContactInfo);
  const phoneLink = getOrganizationPhoneLink(businessContactInfo);
  const address = getOrganizationAddress(businessContactInfo);
  const addressLink = getOrganizationAddressLink(businessContactInfo);
  const embedCode = getGoogleMapsEmbedCode(businessContactInfo);
  const hours = getBusinessHours(businessContactInfo);
  const hoursDisclaimer = businessContactInfo?.businessHoursDisclaimer || '';

  const formTitle = contactFormSettings?.formTitle || 'Send us a message';
  const formSubtitle = contactFormSettings?.formSubtitle || '';

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-15'>
      {/* Left Column - Contact Form */}
      <div
        id='contact-form'
        className='self-start bg-[#2f0909] p-8 lg:p-10 border border-neutral-800'>
        <h3 className='font-heading text-body-xl tracking-[2px] uppercase mb-4 text-brand-white'>
          {formTitle}
        </h3>
        {formSubtitle && <p className='text-body-sm text-neutral-400 mb-6'>{formSubtitle}</p>}
        <ContactForm settings={contactFormSettings} />
      </div>

      {/* Right Column - Contact Details */}
      <div className='flex flex-col gap-7'>
        <h3 className='font-heading text-body-xl tracking-[2px] uppercase text-brand-white'>
          Contact Details
        </h3>

        {/* Address */}
        {address && (
          <div>
            <span className='block font-heading text-body-sm tracking-[2px] uppercase text-brand-primary mb-2'>
              Address
            </span>
            {addressLink ? (
              <a
                href={addressLink}
                target='_blank'
                rel='noopener noreferrer'
                className='text-body-base text-neutral-400 leading-relaxed hover:text-brand-white transition-colors'>
                {address}
              </a>
            ) : (
              <p className='text-body-base text-neutral-400 leading-relaxed'>{address}</p>
            )}
          </div>
        )}

        {/* Google Map */}
        {embedCode && <ContactMap googleMapsEmbedCode={embedCode} />}

        {/* Phone */}
        {phone && (
          <div>
            <span className='block font-heading text-body-sm tracking-[2px] uppercase text-brand-primary mb-2'>
              Phone
            </span>
            <a
              href={phoneLink}
              className='text-body-base text-neutral-400 hover:text-brand-white transition-colors'>
              {phone}
            </a>
          </div>
        )}

        {/* Email */}
        {email && (
          <div>
            <span className='block font-heading text-body-sm tracking-[2px] uppercase text-brand-primary mb-2'>
              Email
            </span>
            <a
              href={emailLink}
              className='text-body-base text-neutral-400 hover:text-brand-white transition-colors'>
              {email}
            </a>
          </div>
        )}

        {/* Hours */}
        {hours && (
          <div>
            <span className='block font-heading text-body-sm tracking-[2px] uppercase text-brand-primary mb-2'>
              Hours
            </span>
            <p className='text-body-base text-neutral-400 leading-relaxed'>{hours}</p>
            {hoursDisclaimer && (
              <p className='text-body-xs text-neutral-400 opacity-75 mt-1 italic'>
                {hoursDisclaimer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
