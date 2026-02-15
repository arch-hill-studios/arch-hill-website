import { useEffect } from 'react';

// Global state to track multiple scroll locks and prevent conflicts
let lockCount = 0;
let originalScrollY = 0;
let isCurrentlyLocked = false;
// Track the pathname when lock was first applied so we can detect navigation
let lockedPathname = '';

// Custom event to notify when all scroll locks are released
const SCROLL_UNLOCK_EVENT = 'bodyScrollUnlocked';

/**
 * Custom hook to lock/unlock body scroll with reference counting
 * Prevents page jumping when multiple components use scroll lock simultaneously
 *
 * Navigation-aware: when the pathname changes between lock and unlock (e.g. the
 * user clicked a link in VerticalNav), the old scroll position is NOT restored
 * because it's meaningless on the new page. NavigationScroll handles scrolling
 * to the correct position instead.
 *
 * NOTE: This check only works for components that lock BEFORE navigation starts
 * (e.g. VerticalNav, which locks when the menu opens). Components that lock
 * DURING navigation (e.g. LoadingOverlay via loading.tsx) should NOT use this
 * hook — see LoadingOverlay.tsx for the alternative approach.
 *
 * @param isLocked - Whether to lock the body scroll
 */
export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      lockCount++;

      // Only apply lock styles on first lock
      if (lockCount === 1 && !isCurrentlyLocked) {
        // Store original scroll position and pathname only once
        originalScrollY = window.scrollY;
        lockedPathname = window.location.pathname;
        isCurrentlyLocked = true;

        // Calculate scrollbar width to prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Apply CSS-based scroll prevention with scrollbar compensation
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${originalScrollY}px`;
        document.body.style.width = '100%';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        lockCount = Math.max(0, lockCount - 1);

        // Only restore when no more locks exist
        if (lockCount === 0 && isCurrentlyLocked) {
          isCurrentlyLocked = false;

          // Restore styles
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.paddingRight = '';

          // Only restore scroll position if we're still on the same page.
          // If the user navigated (pathname changed), the old position is
          // meaningless — NavigationScroll handles the new position.
          const navigated = window.location.pathname !== lockedPathname;
          if (!navigated) {
            window.scrollTo(0, originalScrollY);
          }

          // Notify listeners that all scroll locks are released
          window.dispatchEvent(new CustomEvent(SCROLL_UNLOCK_EVENT));
        }
      };
    }
  }, [isLocked]);
};

/**
 * Hook to detect when all body scroll locks have been released
 * Useful for components that need to wait for scroll restoration to complete
 */
export const useScrollLockStatus = () => {
  return {
    isAnyScrollLocked: () => isCurrentlyLocked,
    onScrollUnlocked: (callback: () => void) => {
      const handleUnlock = () => {
        callback();
        window.removeEventListener(SCROLL_UNLOCK_EVENT, handleUnlock);
      };

      // If no locks are active, call immediately
      if (!isCurrentlyLocked) {
        callback();
        return () => {}; // No cleanup needed
      }

      // Otherwise, listen for unlock event
      window.addEventListener(SCROLL_UNLOCK_EVENT, handleUnlock);
      return () => window.removeEventListener(SCROLL_UNLOCK_EVENT, handleUnlock);
    }
  };
};
