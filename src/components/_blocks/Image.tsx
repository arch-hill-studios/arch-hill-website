'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { ImageBlock } from '@/types/blocks';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';
import UnifiedImage from '../UI/UnifiedImage';
import AnimateIn from '../UI/AnimateIn';

interface ImageProps
  extends ImageBlock, Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  className?: string;
  pathPrefix?: string;
}

type FrameStyle = 'none' | 'red' | 'blue' | 'double';

const getFrameElements = (frameStyle: FrameStyle) => {
  switch (frameStyle) {
    case 'red':
      // Single red/primary frame offset bottom-right
      return (
        <div
          className='absolute border-2 border-brand-primary'
          style={{ top: 15, left: 15, right: -15, bottom: -15 }}
        />
      );
    case 'blue':
      // Single blue/secondary frame offset bottom-left
      return (
        <div
          className='absolute border-2 border-brand-secondary'
          style={{ top: 15, left: -15, right: 15, bottom: -15 }}
        />
      );
    case 'double':
      // Red/primary offset top-right + Blue/secondary offset bottom-left
      return (
        <>
          <div
            className='absolute border-2 border-brand-primary'
            style={{ top: -15, right: -15, bottom: 15, left: 15 }}
          />
          <div
            className='absolute border-2 border-brand-secondary'
            style={{ top: 15, right: 15, bottom: -15, left: -15 }}
          />
        </>
      );
    default:
      return null;
  }
};

const Image: React.FC<ImageProps> = ({
  image,
  size = 'full',
  frameStyle,
  caption,
  className = '',
  documentId,
  documentType,
  pathPrefix,
}) => {
  const cleanSize = stegaClean(size) || 'full';
  const cleanFrameStyle = (stegaClean(frameStyle) || 'none') as FrameStyle;
  const cleanCaption = stegaClean(caption);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-full md:w-1/2 mx-auto';
      case 'full':
      default:
        return 'w-full mx-auto';
    }
  };

  const sizeClasses = getSizeClasses(cleanSize);
  const hasFrame = cleanFrameStyle !== 'none';

  // Create data attribute for caption if Sanity props are provided
  const captionDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, `${pathPrefix}.caption`)
    : {};

  return (
    <AnimateIn animation='slideUp' trigger='scroll' duration={800} threshold={0.2}>
      <figure className={`${sizeClasses} ${className}`}>
        <div className={`relative ${hasFrame ? 'm-3.75' : ''}`}>
          {getFrameElements(cleanFrameStyle)}
          <UnifiedImage
            src={image}
            alt={image?.alt || 'Image'}
            mode='sized'
            width={1200}
            height={800}
            sizeContext='full'
            objectFit='cover'
            enableModal
            modalCaption={cleanCaption}
            generateSchema
            schemaContext='article'
            className={`w-full h-auto rounded-lg ${hasFrame ? 'relative z-10' : ''}`}
            documentId={documentId}
            documentType={documentType}
            fieldPath={pathPrefix ? `${pathPrefix}.image` : 'image'}
          />
        </div>
        {cleanCaption && (
          <figcaption
            className='mt-2 text-body-sm text-gray-600 text-center italic'
            {...captionDataAttribute}>
            {cleanCaption}
          </figcaption>
        )}
      </figure>
    </AnimateIn>
  );
};

export default Image;
