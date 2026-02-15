'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePageLoad } from '@/contexts/PageLoadContext';
import { useScrollLockStatus } from '@/hooks/useBodyScrollLock';

export default function NavigationScroll() {
  const pathname = usePathname();
  const { isPageReady } = usePageLoad();
  const scrollLockStatus = useScrollLockStatus();
  const isInitialMountRef = useRef(true);
  const hasScrolledRef = useRef(false);
  const pendingHashRef = useRef<string>('');

  // Prevent browser's native scroll restoration from interfering with
  // our scroll management. Chrome mobile in particular restores scroll
  // position asynchronously, overriding our scrollTo(0, 0) calls.
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Handle same-page link clicks (e.g., clicking "About" while on /about).
  // Next.js doesn't trigger a pathname change for these, so the scroll
  // effects below never fire. This global handler detects such clicks.
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

  // Handle scroll-to-top on pathname change (no hash).
  // This runs IMMEDIATELY — no need to wait for isPageReady since
  // scrolling to position 0 doesn't require any content in the DOM.
  useEffect(() => {
    // Skip initial mount — browser handles initial scroll position on
    // page load/refresh. Without this, the scroll-to-top fires after
    // PageReadyTrigger detects content, snapping the user back to top
    // even if they've already started scrolling.
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      const hash = window.location.hash;
      if (hash) {
        // Direct visit with hash (e.g., /about#team) — set up for anchor scrolling
        pendingHashRef.current = hash;
        hasScrolledRef.current = false;
      } else {
        // Direct visit without hash — already at top, nothing to do
        hasScrolledRef.current = true;
      }
      return;
    }

    const hash = window.location.hash;

    if (!hash) {
      // No hash: scroll to top immediately
      window.scrollTo(0, 0);
      hasScrolledRef.current = true;
      pendingHashRef.current = '';
    } else {
      // Has hash: defer to the anchor scroll effect below
      pendingHashRef.current = hash;
      hasScrolledRef.current = false;
    }
  }, [pathname]);

  // Handle anchor/hash scrolling — waits for isPageReady because
  // the target element must exist in the DOM before we can scroll to it.
  useEffect(() => {
    if (hasScrolledRef.current || !pendingHashRef.current) return;
    if (!isPageReady) return;

    const attemptAnchorScroll = () => {
      const hash = pendingHashRef.current;
      if (!hash) return true;

      const targetId = hash.substring(1);
      const element = document.getElementById(targetId);

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
          hasScrolledRef.current = true;
          pendingHashRef.current = '';
        });
        return true;
      }
      return false;
    };

    const waitForScrollUnlockAndScroll = () => {
      if (scrollLockStatus.isAnyScrollLocked()) {
        const cleanup = scrollLockStatus.onScrollUnlocked(() => {
          setTimeout(attemptAnchorScroll, 50);
        });
        return cleanup;
      } else {
        attemptAnchorScroll();
        return () => {};
      }
    };

    let cleanup = waitForScrollUnlockAndScroll();

    // If target element not found yet, watch for it with MutationObserver
    if (pendingHashRef.current && !hasScrolledRef.current) {
      const hash = pendingHashRef.current;
      const targetId = hash.substring(1);

      const containsTargetElement = (parentElement: Element) => {
        const targetElement = parentElement.ownerDocument.getElementById(targetId);
        return targetElement && parentElement.contains(targetElement);
      };

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of Array.from(mutation.addedNodes)) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.id === targetId || containsTargetElement(element)) {
                  cleanup();
                  cleanup = waitForScrollUnlockAndScroll();
                  if (!pendingHashRef.current) {
                    observer.disconnect();
                    return;
                  }
                }
              }
            }
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      const handleLoad = () => {
        if (pendingHashRef.current) {
          cleanup();
          cleanup = waitForScrollUnlockAndScroll();
        }
      };

      if (document.readyState !== 'complete') {
        window.addEventListener('load', handleLoad);
      }

      const timeout = setTimeout(() => {
        observer.disconnect();
        window.removeEventListener('load', handleLoad);
        cleanup();
        pendingHashRef.current = '';
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
