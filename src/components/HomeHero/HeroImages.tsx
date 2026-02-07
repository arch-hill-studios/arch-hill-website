'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HeroImage {
  imageUrl: string;
  altText: string;
}

interface HeroImagesProps {
  images: HeroImage[];
  duration?: number;
  onFirstImageLoaded?: () => void;
}

const HeroImages = ({ images, duration = 4000, onFirstImageLoaded }: HeroImagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Track when each image loads
  const handleImageLoad = useCallback(
    (index: number) => {
      setLoadedImages((prev) => new Set(prev).add(index));

      // When first image loads, notify parent
      if (index === 0 && onFirstImageLoaded) {
        onFirstImageLoaded();
      }
    },
    [onFirstImageLoaded]
  );

  // Transition to next image
  useEffect(() => {
    if (images.length <= 1) return; // Don't rotate if only one image

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        setPreviousIndex(prevIndex); // Track the previous index
        return (prevIndex + 1) % images.length;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [duration, images.length]);

  // Don't render anything if no images
  if (images.length === 0) {
    return null;
  }

  // Determine if we should apply zoom effect (only for multiple images)
  const hasMultipleImages = images.length > 1;

  return (
    <div className='absolute top-0 left-0 w-full h-full z-10 overflow-hidden'>
      {images.map((image, index) => {
        const isCurrentImage = index === currentIndex;
        const isPreviousImage = index === previousIndex;
        const isImageLoaded = loadedImages.has(index);

        // All images use smooth transitions
        const shouldUseTransition = true;

        // Show image if it's current (only fade in first image after load, others show immediately when current)
        const shouldShow = isCurrentImage && (index === 0 ? isImageLoaded : true);

        // Keep zoom active for both current image AND previous image (which is fading out)
        const shouldHaveZoom = hasMultipleImages && (isCurrentImage || isPreviousImage);

        return (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full ${
              shouldUseTransition ? 'transition-opacity duration-1000 ease-in-out' : ''
            } ${shouldShow ? 'opacity-100' : 'opacity-0'}`}
            style={
              shouldHaveZoom
                ? {
                    animation: `heroZoom ${duration}ms linear forwards`,
                  }
                : hasMultipleImages
                  ? {
                      transform: 'scale(1)', // Reset for next cycle
                    }
                  : undefined
            }>
            <Image
              priority={index === 0}
              src={image.imageUrl}
              alt={image.altText || `Hero background image ${index + 1}`}
              fill
              className='object-center object-cover opacity-80'
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        );
      })}

      {/* Inline style for the zoom animation */}
      {hasMultipleImages && (
        <style jsx>{`
          @keyframes heroZoom {
            from {
              transform: scale(1);
            }
            to {
              transform: scale(1.1);
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default HeroImages;
