'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';

interface ContactMapProps {
  googleMapsEmbedCode: string;
}

/**
 * Extracts the src URL from a Google Maps iframe embed code
 */
const extractEmbedUrl = (embedCode: string): string | null => {
  const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = embedCode.match(iframeRegex);
  return match ? match[1] : null;
};

const ContactMap = ({ googleMapsEmbedCode }: ContactMapProps) => {
  const cleanEmbedCode = stegaClean(googleMapsEmbedCode);

  if (!cleanEmbedCode) return null;

  const embedUrl = extractEmbedUrl(cleanEmbedCode);

  if (!embedUrl) return null;

  return (
    <div className='mb-6 overflow-hidden border border-neutral-800 grayscale-[50%] contrast-[1.1] transition-[filter] duration-300 hover:grayscale-0 hover:contrast-100'>
      <iframe
        className='block w-full border-0'
        src={embedUrl}
        height={200}
        title='Google Map'
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
        allowFullScreen
      />
    </div>
  );
};

export default ContactMap;
