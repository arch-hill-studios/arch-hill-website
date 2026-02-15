/**
 * PageLoadContext - Manages page content readiness state across the application
 *
 * PURPOSE:
 * This context tracks when a page's main content has fully loaded and is ready to display.
 * It coordinates between content loading, scroll position restoration, and footer visibility
 * to prevent layout shifts and ensure smooth user experience.
 *
 * HOW IT WORKS:
 * 1. PageLoadProvider wraps the app layout and maintains `isPageReady` state
 * 2. PageReadyTrigger component monitors DOM for content readiness signals
 * 3. When content is ready, PageReadyTrigger calls `setPageReady()`
 * 4. Other components consume `isPageReady` to coordinate their behavior
 *
 * KEY CONSUMERS:
 * - Footer.tsx: Uses `isPageReady` to fade in footer opacity (prevents flash during loading)
 * - NavigationScroll.tsx: Waits for `isPageReady` before attempting anchor link navigation
 *   (ensures target elements exist in DOM before scrolling)
 *
 * RELATED COMPONENTS:
 * - PageReadyTrigger: Detects when page content is ready (checks for images, main content, etc.)
 * - NavigationScroll: Coordinates anchor scrolling with page readiness and scroll lock state
 *
 * FALLBACK PROTECTION:
 * - 2-second timeout in provider ensures `isPageReady` becomes true even if trigger fails
 * - 5-second timeout in PageReadyTrigger provides additional safety net
 * - Multiple detection methods (DOM checks, image loading, window load events)
 *
 * TYPICAL FLOW:
 * 1. User navigates to page → isPageReady = false
 * 2. Content renders, PageReadyTrigger monitors DOM
 * 3. Main content + images loaded → setPageReady() called
 * 4. isPageReady = true → Footer fades in, anchor navigation enabled
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageLoadContextType {
  isPageReady: boolean;
  setPageReady: () => void;
}

const PageLoadContext = createContext<PageLoadContextType | undefined>(undefined);

export const usePageLoad = (): PageLoadContextType => {
  const context = useContext(PageLoadContext);
  if (!context) {
    throw new Error('usePageLoad must be used within a PageLoadProvider');
  }
  return context;
};

interface PageLoadProviderProps {
  children: React.ReactNode;
}

export const PageLoadProvider: React.FC<PageLoadProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [isPageReady, setIsPageReady] = useState(false);
  const prevPathnameRef = useRef(pathname);

  const setPageReady = useCallback(() => {
    setIsPageReady(true);
  }, []);

  // Reset isPageReady when navigating to a different page so that
  // NavigationScroll waits for new content before attempting scroll
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setIsPageReady(false);
    }
  }, [pathname]);

  // Fallback timeout to ensure footer shows even if setPageReady isn't called
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isPageReady) {
        setIsPageReady(true);
      }
    }, 2000); // 2 second fallback

    return () => clearTimeout(fallbackTimer);
  }, [isPageReady]);

  return (
    <PageLoadContext.Provider value={{ isPageReady, setPageReady }}>
      {children}
    </PageLoadContext.Provider>
  );
};