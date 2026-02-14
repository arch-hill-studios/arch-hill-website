'use client';

import React, { useState } from 'react';
import { stegaClean } from 'next-sanity';
import type { ImageGalleryBlock } from '@/types/blocks';
import type { SanityLiveEditingProps } from '../../utils/sectionHelpers';
import ImageGalleryModal from '../Modals/ImageGalleryModal';
import UnifiedImage from '../UI/UnifiedImage';
import AnimateIn from '../UI/AnimateIn';

interface ImageGalleryProps
  extends ImageGalleryBlock,
    Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  className?: string;
  pathPrefix?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  columns = '3',
  images,
  showCaptionsBelowImages = false,
  className = '',
  documentId,
  documentType,
  pathPrefix,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  if (!images || !Array.isArray(images)) {
    return null;
  }

  const cleanColumns = stegaClean(columns) || '3';
  const validColumns = ['2', '3', '4'].includes(cleanColumns) ? cleanColumns : '3';

  const getGridClasses = (cols: string) => {
    switch (cols) {
      case '2':
        return 'w-[calc(50%-16px)]';
      case '3':
        return 'w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]';
      case '4':
        return 'w-[calc(50%-16px)] lg:w-[calc(25%-24px)]';
      default:
        return 'w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]';
    }
  };

  const gridClasses = getGridClasses(validColumns);

  return (
    <>
      <div
        className={`w-full flex justify-center flex-wrap gap-x-3 gap-y-3 md:gap-x-8 md:gap-y-4 ${className}`}
        role='region'
        aria-label={`Image gallery with ${images.length} images`}>
        {images.map((item, idx) => {
          const hasImage = item.image?.asset;
          const imageAlt =
            hasImage && item.image
              ? stegaClean(item.image.alt) || `Gallery image ${idx + 1}`
              : `Gallery placeholder ${idx + 1}`;

          // Calculate the actual index in the filtered images array (only images with assets)
          const filteredImageIndex = images
            .slice(0, idx)
            .filter((item) => item.image?.asset).length;

          const caption = item.caption ? stegaClean(item.caption) : null;
          const showCaption = showCaptionsBelowImages && caption;

          return (
            <AnimateIn
              key={item._key || idx}
              animation='slideUp'
              trigger='scroll'
              duration={800}
              delay={idx * 100}
              threshold={0.2}
              className={gridClasses}>
              <figure>
                <button
                  onClick={() => {
                    if (hasImage) {
                      setSelectedImageIndex(filteredImageIndex);
                      setIsModalOpen(true);
                    }
                  }}
                  className='relative cursor-pointer transition hover:scale-102 aspect-4/3 block w-full'
                  tabIndex={0}
                  aria-label={
                    hasImage
                      ? `Open image ${idx + 1} of ${images.length} in modal: ${imageAlt}`
                      : `Gallery placeholder ${idx + 1}`
                  }
                  aria-describedby={`gallery-image-${idx}`}
                  disabled={!hasImage}>
                  <UnifiedImage
                    src={item.image}
                    alt={imageAlt}
                    mode='fill'
                    sizeContext='gallery'
                    objectFit='cover'
                    generateSchema
                    schemaContext='gallery'
                    sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                    className='rounded-lg'
                  />
                </button>
                {showCaption && (
                  <figcaption className='mt-2 text-center font-bold'>{caption}</figcaption>
                )}
              </figure>
            </AnimateIn>
          );
        })}
      </div>
      <ImageGalleryModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        images={images.filter((item) => item.image?.asset)}
        initialIndex={selectedImageIndex}
        documentId={documentId}
        documentType={documentType}
        pathPrefix={pathPrefix}
      />
    </>
  );
};

export default ImageGallery;
