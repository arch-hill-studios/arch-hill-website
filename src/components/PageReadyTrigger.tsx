'use client';

import { useEffect, useCallback } from 'react';
import { usePageLoad } from '@/contexts/PageLoadContext';

const PageReadyTrigger = () => {
  const { setPageReady } = usePageLoad();

  const checkContentReady = useCallback(() => {
    // Check for main content elements that indicate the page is loaded
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return false;

    // Check if main content has substantial content (more than just loading states)
    const hasSubstantialContent = mainContent.children.length > 0;

    // Check if images are loaded (common CMS content)
    const images = mainContent.querySelectorAll('img');
    const allImagesLoaded = Array.from(images).every(img => img.complete || img.naturalHeight !== 0);

    // Check if dynamic content blocks are rendered
    const hasPageBuilder = mainContent.querySelector('[data-page-builder], .page-builder-content');
    const hasHeroContent = document.querySelector('[data-hero], .hero-content, .hero-section');

    return hasSubstantialContent && allImagesLoaded && (hasPageBuilder || hasHeroContent);
  }, []);

  useEffect(() => {
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 100; // Maximum attempts to prevent infinite checking

    const checkAndTriggerReady = () => {
      attempts++;

      if (isReady || attempts > maxAttempts) {
        return;
      }

      if (checkContentReady()) {
        isReady = true;
        setPageReady();
        return;
      }

      // Continue checking every 100ms
      setTimeout(checkAndTriggerReady, 100);
    };

    // Start checking after initial render
    const initialDelay = setTimeout(() => {
      checkAndTriggerReady();
    }, 50);

    // Fallback timeout to ensure it eventually triggers even if checks fail
    const fallbackTimeout = setTimeout(() => {
      if (!isReady) {
        isReady = true;
        setPageReady();
      }
    }, 5000); // 5 second fallback

    // Listen for window load as additional signal
    const handleLoad = () => {
      if (!isReady && checkContentReady()) {
        isReady = true;
        setPageReady();
      }
    };

    if (document.readyState !== 'complete') {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(fallbackTimeout);
      window.removeEventListener('load', handleLoad);
    };
  }, [setPageReady, checkContentReady]);

  return null; // This component doesn't render anything
};

export default PageReadyTrigger;