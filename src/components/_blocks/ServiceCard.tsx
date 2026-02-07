import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import ItemList from './ItemList';
import type { ServiceCardBlock } from '@/types/blocks';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import ExpandingContentWrapper from '../UI/ExpandingContentWrapper';
import AnimateIn from '../UI/AnimateIn';

interface ServiceCardProps extends Omit<ServiceCardBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  index?: number;
}

const ServiceCard = ({
  image,
  title,
  subtitle,
  description,
  list,
  pricingInfo,
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
  index = 0,
}: ServiceCardProps) => {
  // Determine if image should be on left (odd index) or right (even index)
  const isImageOnLeft = index % 2 === 0;

  // Convert description text to preserve line breaks
  const formattedDescription = description?.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < description.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div
      className={`w-full mx-auto ${className}`.trim()}
      {...(documentId && documentType
        ? createSanityDataAttribute(documentId, documentType, fieldPathPrefix)
        : {})}>
      <div className='flex flex-col md:flex-row md:items-start gap-6 rounded-2xl bg-brand-white/8 backdrop-blur-[20px] p-6 md:p-8'>
        {/* Image Container - Desktop order changes based on index */}
        {image && (
          <AnimateIn
            animation='fade'
            trigger='scroll'
            duration={800}
            threshold={0.5}
            className={`w-full md:w-1/3 shrink-0 ${isImageOnLeft ? 'md:order-1' : 'md:order-2'}`}>
            <div className='relative w-full aspect-4/3 overflow-hidden rounded-xl'>
              <UnifiedImage
                src={image}
                alt={image.alt || title || 'Service image'}
                mode='fill'
                sizeContext='full'
                objectFit='cover'
                documentId={documentId}
                documentType={documentType}
                fieldPath={fieldPathPrefix ? `${fieldPathPrefix}.image` : 'image'}
              />
            </div>
          </AnimateIn>
        )}

        {/* Content Container */}
        <div
          className={`flex flex-col text-center md:text-left gap-4 ${isImageOnLeft ? 'md:order-2' : 'md:order-1'}`}>
          <AnimateIn animation='slideUp' trigger='scroll' duration={800} threshold={0.5}>
            <>
              {/* Title */}
              <p
                className='text-h3 text-gradient-primary font-bold'
                {...(documentId && documentType
                  ? createSanityDataAttribute(documentId, documentType, `${fieldPathPrefix}.title`)
                  : {})}>
                {title}
              </p>

              {/* Subtitle */}
              {subtitle && (
                <p
                  className='text-body-xl text-brand-white/90'
                  {...(documentId && documentType
                    ? createSanityDataAttribute(
                        documentId,
                        documentType,
                        `${fieldPathPrefix}.subtitle`
                      )
                    : {})}>
                  {subtitle}
                </p>
              )}
            </>
          </AnimateIn>

          {/* Expandable Content Container (Mobile) / Always Visible (Desktop) */}
          <ExpandingContentWrapper
            expandLabel='Learn More'
            collapseLabel='View Less'
            showOnDesktop={false}>
            {/* Description */}
            <AnimateIn animation='slideUp' trigger='scroll' duration={800} threshold={0.5}>
              <p
                className='text-brand-white/80 mb-4'
                {...(documentId && documentType
                  ? createSanityDataAttribute(
                      documentId,
                      documentType,
                      `${fieldPathPrefix}.description`
                    )
                  : {})}>
                {formattedDescription}
              </p>
            </AnimateIn>

            {/* List */}
            {list && list.items && list.items.length > 0 && (
              <AnimateIn animation='slideUp' trigger='scroll' duration={800} threshold={0.5}>
                <ItemList title={list.title} items={list.items} inheritAlignment='left' />
              </AnimateIn>
            )}
          </ExpandingContentWrapper>

          {/* Pricing Info */}
          {pricingInfo && (
            <AnimateIn animation='slideUp' trigger='scroll' duration={800} threshold={0.5}>
              <p
                className='text-body-2xl text-gradient-primary font-bold mt-2'
                {...(documentId && documentType
                  ? createSanityDataAttribute(
                      documentId,
                      documentType,
                      `${fieldPathPrefix}.pricingInfo`
                    )
                  : {})}>
                {pricingInfo}
              </p>
            </AnimateIn>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
