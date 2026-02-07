'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { YouTubeVideo as YouTubeVideoType } from '@/sanity/types';
import { maxCardWidth } from '@/utils/spacingConstants';

interface YouTubeVideoProps extends YouTubeVideoType {
  className?: string;
}

const getEmbedUrl = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ url, className = '' }) => {
  const cleanUrl = stegaClean(url);

  if (!cleanUrl) {
    return null;
  }

  const embedUrl = getEmbedUrl(cleanUrl);

  if (!embedUrl) {
    return (
      <div className={`${className} p-4 border border-red-200 rounded-lg bg-red-50`}>
        <p className='text-red-600'>Invalid YouTube URL provided</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative ${maxCardWidth} mx-auto`}>
      <iframe
        className='rounded-2xl lg:rounded-[1.25rem] w-full aspect-video'
        src={embedUrl}
        title='YouTube Video'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeVideo;
