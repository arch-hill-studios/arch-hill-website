'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { ImageBlock } from '@/types/blocks';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';
import UnifiedImage from '../UI/UnifiedImage';
import AnimateIn from '../UI/AnimateIn';

interface ImageProps
  extends ImageBlock,
    Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  className?: string;
  pathPrefix?: string;
}

const Image: React.FC<ImageProps> = ({
  image,
  size = 'full',
  caption,
  className = '',
  documentId,
  documentType,
  pathPrefix,
}) => {
  const cleanSize = stegaClean(size) || 'full';
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

  // Create data attribute for caption if Sanity props are provided
  const captionDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, `${pathPrefix}.caption`)
    : {};

  return (
    <AnimateIn
      animation='slideUp'
      trigger='scroll'
      duration={800}
      threshold={0.2}>
      <figure className={`${sizeClasses} ${className}`}>
        <UnifiedImage
          src={image}
          alt="Content image"
          mode="sized"
          width={1200}
          height={800}
          sizeContext="full"
          objectFit="cover"
          enableModal
          modalCaption={cleanCaption}
          generateSchema
          schemaContext="article"
          className="w-full h-auto rounded-lg"
          documentId={documentId}
          documentType={documentType}
          fieldPath={pathPrefix ? `${pathPrefix}.image` : 'image'}
        />
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
