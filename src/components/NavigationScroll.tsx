'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePageLoad } from '@/contexts/PageLoadContext';
import { useScrollLockStatus } from '@/hooks/useBodyScrollLock';

export default function NavigationScroll() {
  const pathname = usePathname();
  const { isPageReady } = usePageLoad();
  const scrollLockStatus = useScrollLockStatus();
  const hasScrolledRef = useRef(false);
  const currentHashRef = useRef('');
  const pendingScrollRef = useRef<string>('');

  useEffect(() => {
    // Update current hash and pending scroll whenever pathname changes
    currentHashRef.current = window.location.hash;
    pendingScrollRef.current = window.location.hash;
    hasScrolledRef.current = false;
  }, [pathname]);

  // Handle same-page link clicks (e.g., clicking "About" while on /about).
  // Next.js doesn't trigger a pathname change for these, so NavigationScroll's
  // main effect never fires. This global handler detects such clicks and scrolls to top.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link || link.target === '_blank') return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        // Same pathname, no hash → scroll to top
        if (url.pathname === pathname && !url.hash) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } catch {
        // Invalid URL, ignore
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  useEffect(() => {
    // If we've already scrolled for this hash, don't scroll again
    if (hasScrolledRef.current && currentHashRef.current === window.location.hash) {
      return;
    }

    const attemptScroll = () => {
      const hash = pendingScrollRef.current || window.location.hash;

      // If there's no hash, scroll to top
      if (!hash) {
        window.scrollTo(0, 0);
        hasScrolledRef.current = true;
        pendingScrollRef.current = '';
        return true;
      }

      const targetId = hash.substring(1); // Remove the # symbol
      const element = document.getElementById(targetId);

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
          hasScrolledRef.current = true;
          pendingScrollRef.current = '';
        });
        return true;
      }
      return false;
    };

    const waitForScrollUnlockAndScroll = () => {
      // Check if any scroll locks are active
      if (scrollLockStatus.isAnyScrollLocked()) {
        // Wait for scroll locks to be released
        const cleanup = scrollLockStatus.onScrollUnlocked(() => {
          // Add small delay to ensure scroll restoration is complete
          setTimeout(attemptScroll, 50);
        });
        return cleanup;
      } else {
        // No scroll locks active, attempt immediately
        attemptScroll();
        return () => {};
      }
    };

    // Only proceed if page is ready
    if (!isPageReady) {
      return;
    }

    // Try to scroll, waiting for scroll locks if needed
    let cleanup = waitForScrollUnlockAndScroll();

    // If initial attempt failed (element not found), set up observers
    if (pendingScrollRef.current && hasScrolledRef.current === false) {
      const hash = pendingScrollRef.current;
      const targetId = hash.substring(1);

      // Helper function to safely check for element within parent
      const containsTargetElement = (parentElement: Element) => {
        const targetElement = parentElement.ownerDocument.getElementById(targetId);
        return targetElement && parentElement.contains(targetElement);
      };

      // Use MutationObserver to watch for the element being added to the DOM
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            for (const node of addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check if the added element is our target or contains our target
                if (element.id === targetId || containsTargetElement(element)) {
                  cleanup(); // Clean up previous scroll unlock listener
                  cleanup = waitForScrollUnlockAndScroll();
                  if (!pendingScrollRef.current) {
                    observer.disconnect();
                    return;
                  }
                }
              }
            }
          }
        }
      });

      // Start observing DOM changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Also listen for window load as a fallback
      const handleLoad = () => {
        if (pendingScrollRef.current) {
          cleanup(); // Clean up previous scroll unlock listener
          cleanup = waitForScrollUnlockAndScroll();
        }
      };

      if (document.readyState !== 'complete') {
        window.addEventListener('load', handleLoad);
      }

      // Cleanup timeout - stop trying after 10 seconds
      const timeout = setTimeout(() => {
        observer.disconnect();
        window.removeEventListener('load', handleLoad);
        cleanup();
        pendingScrollRef.current = '';
      }, 10000);

      return () => {
        observer.disconnect();
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
        cleanup();
      };
    }

    return cleanup;
  }, [pathname, isPageReady, scrollLockStatus]);

  return null;
}
