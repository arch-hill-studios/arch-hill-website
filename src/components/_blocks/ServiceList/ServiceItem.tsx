import React from 'react';
import { stegaClean } from 'next-sanity';
import type { BlockContent, ServiceImageImage } from '@/sanity/types';
import type { InternalLinkType } from '@/types/shared';
import { createComponents } from '@/sanity/portableTextComponents';
import PortableTextWrapper from '@/components/UI/PortableTextWrapper';
import ServiceImageSlideshow from './ServiceImageSlideshow';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import ServiceItemAnimated from './ServiceItemAnimated';
import CTA from '@/components/UI/CTA';

interface ServiceImageItem {
  image?: ServiceImageImage;
  _type: 'serviceImage';
  _key: string;
}

interface ServiceItemCTA {
  text?: string;
  linkType?: string;
  internalLink?: InternalLinkType;
  externalUrl?: string;
  openInNewTab?: boolean;
  computedHref?: string;
}

interface ServiceItemProps {
  title?: string;
  description?: BlockContent;
  price?: string;
  disclaimer?: string;
  cta?: ServiceItemCTA | null;
  images?: ServiceImageItem[];
  index: number;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const ServiceItem = ({
  title,
  description,
  price,
  disclaimer,
  cta,
  images,
  index,
  documentId,
  documentType,
  fieldPathPrefix = '',
}: ServiceItemProps) => {
  const variant = index % 2 === 0 ? 'red' : 'blue';
  const isRed = variant === 'red';
  const validImages = images?.filter((item) => item.image?.asset) || [];
  const hasImages = validImages.length > 0;
  const components = createComponents('left');

  // Resolve CTA href (using same pattern as CTAButton)
  let ctaHref = '';
  const ctaText = stegaClean(cta?.text);
  if (cta && ctaText) {
    if (cta.computedHref) {
      ctaHref = stegaClean(cta.computedHref);
    } else if (
      cta.linkType === 'internal' &&
      cta.internalLink &&
      'href' in cta.internalLink &&
      cta.internalLink.href
    ) {
      ctaHref = cta.internalLink.href;
    } else if (cta.linkType === 'external' && cta.externalUrl) {
      ctaHref = stegaClean(cta.externalUrl);
    }
  }
  const ctaOpenInNewTab =
    cta?.linkType === 'external' || (cta?.linkType === 'internal' && cta?.openInNewTab);

  return (
    <ServiceItemAnimated variant={variant}>
      {(animation, containerRef) => (
        <div
          ref={containerRef}
          className='relative min-h-125 max-lg:min-h-0 max-lg:flex max-lg:flex-col'>
          {/* Service Title */}
          <h3
            className={`font-heading text-body-3xl tracking-[4px] uppercase text-brand-white relative z-5 mb-5 max-lg:order-1 ${animation.title} ${
              isRed
                ? 'w-1/2 pr-10 max-lg:w-full max-lg:pr-0 max-lg:text-center'
                : 'w-1/2 ml-auto text-right pl-10 max-lg:w-full max-lg:ml-0 max-lg:text-center max-lg:pl-0'
            }`}
            style={animation.titleStyle}
            {...(documentId && documentType
              ? createSanityDataAttribute(documentId, documentType, `${fieldPathPrefix}.title`)
              : {})}>
            {title}
          </h3>

          {/* Service Image / Slideshow - on mobile appears between title and card */}
          {hasImages && (
            <div
              className={`lg:absolute lg:top-0 lg:w-[55%] z-2 max-lg:relative max-lg:w-full max-lg:order-2 ${animation.image} ${
                isRed ? 'lg:right-0' : 'lg:left-0'
              }`}
              style={animation.imageStyle}>
              <ServiceImageSlideshow
                images={validImages}
                serviceTitle={title || 'Service'}
                variant={variant}
              />
            </div>
          )}

          {/* Service Card (carpet background) */}
          <div
            className={`relative z-1 p-10 max-lg:order-3 ${animation.card} ${
              isRed
                ? 'w-[calc(50%+80px)] border-l-[7px] border-brand-primary rounded-bl-[75px] pr-30 max-lg:w-full max-lg:border-l-0 max-lg:border-b-[7px] max-lg:border-brand-primary max-lg:rounded-bl-[40px] max-lg:rounded-br-[40px] max-lg:rounded-tl-none max-lg:pr-7.5 max-lg:p-7.5'
                : 'w-[calc(50%+80px)] ml-auto border-r-[7px] border-brand-secondary rounded-br-[75px] pl-30 max-lg:w-full max-lg:ml-0 max-lg:border-r-0 max-lg:border-b-[7px] max-lg:border-brand-secondary max-lg:rounded-bl-[40px] max-lg:rounded-br-[40px] max-lg:rounded-tl-none max-lg:pl-7.5 max-lg:p-7.5'
            }`}
            style={animation.cardStyle}>
            {/* Carpet background overlay */}
            <div
              className={`absolute inset-0 ${
                isRed
                  ? 'rounded-bl-[75px] max-lg:rounded-bl-[40px] max-lg:rounded-br-[40px] max-lg:rounded-tl-none'
                  : 'rounded-br-[75px] max-lg:rounded-bl-[40px] max-lg:rounded-br-[40px] max-lg:rounded-tl-none'
              }`}
              style={{
                background: `linear-gradient(rgba(10,10,10,0.5), rgba(10,10,10,0.5)), url('/images/carpets/${isRed ? 'carpet-red' : 'carpet-blue'}.jpg') center center / cover no-repeat`,
              }}
            />

            {/* Content */}
            <div
              className={`relative z-2 ${
                isRed
                  ? 'max-w-[calc(100%-80px)] max-lg:max-w-full'
                  : 'ml-auto max-w-[calc(100%-80px)] max-lg:max-w-full max-lg:ml-0'
              }`}>
              {/* Description */}
              {description && (
                <div
                  className={`text-brand-white leading-[1.8] mb-10 ${animation.description}`}
                  style={animation.descriptionStyle}
                  {...(documentId && documentType
                    ? createSanityDataAttribute(
                        documentId,
                        documentType,
                        `${fieldPathPrefix}.description`,
                      )
                    : {})}>
                  <PortableTextWrapper value={description} components={components} />
                </div>
              )}

              {/* CTA Link */}
              {ctaHref && ctaText && (
                <div className={`mb-5 ${animation.cta}`} style={animation.ctaStyle}>
                  <CTA
                    href={ctaHref}
                    variant='text-link'
                    target={ctaOpenInNewTab ? '_blank' : undefined}
                    rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}>
                    {ctaText}
                  </CTA>
                </div>
              )}

              {/* Pricing */}
              {price && (
                <div
                  className={`mt-6 pt-5 border-t border-brand-white/20 ${animation.pricing}`}
                  style={animation.pricingStyle}>
                  <span
                    className='block font-heading text-body-2xl tracking-[2px] text-brand-white mb-2.5'
                    {...(documentId && documentType
                      ? createSanityDataAttribute(
                          documentId,
                          documentType,
                          `${fieldPathPrefix}.price`,
                        )
                      : {})}>
                    {price}
                  </span>
                  {disclaimer && (
                    <p
                      className='text-body-xs text-brand-white/60 leading-normal italic'
                      {...(documentId && documentType
                        ? createSanityDataAttribute(
                            documentId,
                            documentType,
                            `${fieldPathPrefix}.disclaimer`,
                          )
                        : {})}>
                      {disclaimer}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ServiceItemAnimated>
  );
};

export default ServiceItem;
