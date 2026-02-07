'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import { maxCardWidth } from '@/utils/spacingConstants';
import AnimateIn from '../UI/AnimateIn';

interface GoogleMapProps {
  /** Google Maps embed code from businessContactInfo */
  googleMapsEmbedCode: string;
  className?: string;
}

/**
 * Extracts the src URL from a Google Maps iframe embed code
 */
const extractEmbedUrl = (embedCode: string): string | null => {
  const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = embedCode.match(iframeRegex);
  return match ? match[1] : null;
};

const GoogleMap: React.FC<GoogleMapProps> = ({ googleMapsEmbedCode, className = '' }) => {
  const cleanEmbedCode = stegaClean(googleMapsEmbedCode);

  if (!cleanEmbedCode) {
    return (
      <div
        className={`${className} p-4 border border-yellow-200 rounded-lg bg-yellow-50 ${maxCardWidth} mx-auto`}>
        <p className='text-yellow-700'>
          Google Maps iframe not found. Configure in Site Management → Business &amp; Contact Info.
        </p>
      </div>
    );
  }

  const embedUrl = extractEmbedUrl(cleanEmbedCode);

  if (!embedUrl) {
    return (
      <div
        className={`${className} p-4 border border-red-200 rounded-lg bg-red-50 ${maxCardWidth} mx-auto`}>
        <p className='text-red-600'>Invalid Google Maps embed code provided</p>
      </div>
    );
  }

  return (
    <AnimateIn animation='scaleUp' trigger='scroll' duration={800} threshold={0.5}>
      <div
        className={`${className} relative ${maxCardWidth} mx-auto w-full aspect-4/3 overflow-hidden`}>
        <iframe
          className='absolute inset-0 w-full h-full rounded-2xl lg:rounded-[1.25rem] border-0'
          src={embedUrl}
          title='Google Map'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          allowFullScreen
        />
      </div>
    </AnimateIn>
  );
};

export default GoogleMap;
