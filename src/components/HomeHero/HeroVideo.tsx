'use client';

import React, { useCallback, useRef } from 'react';

interface HeroVideoProps {
  videoUrl: string;
  onVideoLoaded?: () => void;
}

const HeroVideo = ({ videoUrl, onVideoLoaded }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Track when video loads
  const handleVideoLoad = useCallback(() => {
    console.log('HeroVideo: Video loaded successfully');
    if (onVideoLoaded) {
      onVideoLoaded();
    }
  }, [onVideoLoaded]);

  // Handle video errors
  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('HeroVideo: Video failed to load', {
      videoUrl,
      error: e.currentTarget.error,
      networkState: e.currentTarget.networkState,
      readyState: e.currentTarget.readyState,
    });
  }, [videoUrl]);

  // Don't render anything if no video URL
  if (!videoUrl) {
    console.warn('HeroVideo: No video URL provided');
    return null;
  }

  console.log('HeroVideo: Rendering with URL:', videoUrl);

  // Determine video type from URL extension
  const getVideoType = (url: string) => {
    if (url.endsWith('.webm')) return 'video/webm';
    if (url.endsWith('.mov')) return 'video/quicktime';
    return 'video/mp4'; // default to mp4
  };

  const videoType = getVideoType(videoUrl);
  console.log('HeroVideo: Video type detected:', videoType);

  return (
    <div className='absolute top-0 left-0 w-full h-full z-10 overflow-hidden'>
      <video
        ref={videoRef}
        src={videoUrl}
        className='absolute top-0 left-0 w-full h-full object-cover object-center opacity-80'
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onCanPlay={() => console.log('HeroVideo: Can play')}
        onLoadStart={() => console.log('HeroVideo: Load started')}
        onLoadedMetadata={() => console.log('HeroVideo: Metadata loaded')}
        preload='auto'
      />
    </div>
  );
};

export default HeroVideo;
