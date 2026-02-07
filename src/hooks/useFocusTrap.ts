import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the currently focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
    };

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];

    // Focus the first element when the trap becomes active
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const currentFocusableElements = getFocusableElements();
      const currentFirstElement = currentFocusableElements[0];
      const currentLastElement = currentFocusableElements[currentFocusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === currentFirstElement) {
          e.preventDefault();
          currentLastElement?.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === currentLastElement) {
          e.preventDefault();
          currentFirstElement?.focus();
        }
      }
    };

    // Add event listener
    container.addEventListener('keydown', handleTabKey);

    // Cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
      
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current && previousActiveElementRef.current.focus) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};