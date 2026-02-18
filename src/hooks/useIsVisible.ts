'use client';

import { useState, useEffect, RefObject } from 'react';

const useIsVisible = (
  ref: RefObject<HTMLElement | null>,
  initialValue = false
) => {
  const [isVisible, setIsVisible] = useState(initialValue);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};

export default useIsVisible;
