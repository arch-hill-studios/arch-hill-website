import { useEffect } from 'react';

// Global state to track multiple scroll locks and prevent conflicts
let lockCount = 0;
let originalScrollY = 0;
let isCurrentlyLocked = false;

// Custom event to notify when all scroll locks are released
const SCROLL_UNLOCK_EVENT = 'bodyScrollUnlocked';

/**
 * Custom hook to lock/unlock body scroll with reference counting
 * Prevents page jumping when multiple components use scroll lock simultaneously
 * @param isLocked - Whether to lock the body scroll
 */
export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      lockCount++;

      // Only apply lock styles on first lock
      if (lockCount === 1 && !isCurrentlyLocked) {
        // Store original scroll position only once
        originalScrollY = window.scrollY;
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

          // Restore scroll position and styles
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.paddingRight = '';

          // Use requestAnimationFrame to ensure DOM is ready for scroll restoration
          requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollY);

            // Dispatch custom event to notify that all scroll locks are released
            // This allows other components (like NavigationScroll) to wait for full release
            window.dispatchEvent(new CustomEvent(SCROLL_UNLOCK_EVENT));
          });
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
