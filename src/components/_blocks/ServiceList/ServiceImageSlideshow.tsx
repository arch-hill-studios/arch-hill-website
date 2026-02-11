'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import type { ServiceImageImage } from '@/sanity/types';

interface ServiceImageItem {
  image?: ServiceImageImage;
  _type: 'serviceImage';
  _key: string;
}

interface ServiceImageSlideshowProps {
  images: ServiceImageItem[];
  serviceTitle: string;
  variant: 'red' | 'blue';
}

const ServiceImageSlideshow = ({
  images,
  serviceTitle,
  variant,
}: ServiceImageSlideshowProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validImages = images.filter((item) => item.image?.asset);
  const hasMultiple = validImages.length > 1;

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, 5000);
  }, [stopAutoPlay, validImages.length]);

  const handleManualNav = useCallback(
    (direction: 'prev' | 'next') => {
      stopAutoPlay();
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }

      setActiveIndex((prev) => {
        if (direction === 'next') {
          return (prev + 1) % validImages.length;
        }
        return (prev - 1 + validImages.length) % validImages.length;
      });

      resumeTimerRef.current = setTimeout(startAutoPlay, 10000);
    },
    [stopAutoPlay, startAutoPlay, validImages.length]
  );

  useEffect(() => {
    if (hasMultiple) {
      startAutoPlay();
    }
    return () => {
      stopAutoPlay();
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [hasMultiple, startAutoPlay, stopAutoPlay]);

  if (validImages.length === 0) return null;

  const borderClass =
    variant === 'red'
      ? 'border-r-[7px] border-brand-primary rounded-tr-[75px] lg:rounded-tr-[75px]'
      : 'border-l-[7px] border-brand-secondary rounded-tl-[75px] lg:rounded-tl-[75px]';

  const mobileBorderClass =
    variant === 'red'
      ? 'max-lg:border-r-0 max-lg:border-l-0 max-lg:border-t-[7px] max-lg:border-brand-primary max-lg:rounded-tl-[40px] max-lg:rounded-tr-[40px] max-lg:rounded-bl-none'
      : 'max-lg:border-l-0 max-lg:border-r-0 max-lg:border-t-[7px] max-lg:border-brand-secondary max-lg:rounded-tl-[40px] max-lg:rounded-tr-[40px] max-lg:rounded-bl-none';

  return (
    <div
      className={`relative w-full h-[300px] lg:h-[480px] overflow-hidden ${borderClass} ${mobileBorderClass}`}>
      {validImages.map((item, index) => (
        <div
          key={item._key}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
          <UnifiedImage
            src={item.image}
            alt={item.image?.alt || `${serviceTitle} image ${index + 1}`}
            mode='fill'
            sizeContext='hero'
            objectFit='cover'
            sizes='(max-width: 1024px) 100vw, 55vw'
          />
        </div>
      ))}

      {hasMultiple && (
        <div className='absolute bottom-4 left-0 right-0 flex justify-between px-4 lg:bottom-5 lg:px-5 z-10 pointer-events-none'>
          <button
            onClick={() => handleManualNav('prev')}
            className='w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] border-none rounded-full bg-brand-dark/35 text-white/60 cursor-pointer flex items-center justify-center transition-colors duration-300 hover:bg-brand-dark/60 hover:text-white/90 pointer-events-auto'
            aria-label='Previous image'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'>
              <path d='M15 18l-6-6 6-6' />
            </svg>
          </button>
          <button
            onClick={() => handleManualNav('next')}
            className='w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] border-none rounded-full bg-brand-dark/35 text-white/60 cursor-pointer flex items-center justify-center transition-colors duration-300 hover:bg-brand-dark/60 hover:text-white/90 pointer-events-auto'
            aria-label='Next image'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'>
              <path d='M9 18l6-6-6-6' />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceImageSlideshow;
