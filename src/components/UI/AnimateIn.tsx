'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AnimateIn - A flexible animation wrapper component
 *
 * Supports multiple trigger types and animation styles for maximum flexibility.
 * Designed to be easily extended with new animation types and trigger conditions.
 */

export type AnimationType =
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'fade'
  | 'scaleUp'
  | 'scaleDown';

export type TriggerType =
  | 'mount' // Triggers immediately on component mount (for above-fold content)
  | 'scroll' // Triggers when element enters viewport (for below-fold content)
  | 'delay'; // Triggers after a delay (useful for sequential animations)

interface AnimateInProps {
  children: React.ReactNode;
  /** Type of animation to apply */
  animation?: AnimationType;
  /** When to trigger the animation */
  trigger?: TriggerType;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Delay before animation starts (in milliseconds) */
  delay?: number;
  /** For scroll trigger: animate only once or every time element enters viewport */
  triggerOnce?: boolean;
  /** For scroll trigger: how much of element should be visible (0-1) to trigger */
  threshold?: number;
  /** Additional CSS classes to apply to wrapper */
  className?: string;
  /** Custom easing function */
  easing?: 'out' | 'in' | 'in-out' | 'linear';
}

const AnimateIn = ({
  children,
  animation = 'slideUp',
  trigger = 'scroll',
  duration = 1000,
  delay = 0,
  triggerOnce = true,
  threshold = 0.1,
  className = '',
  easing = 'out',
}: AnimateInProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Handle mount and delay triggers
  useEffect(() => {
    if (trigger === 'mount' || trigger === 'delay') {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  // Handle scroll trigger with Intersection Observer
  useEffect(() => {
    if (trigger !== 'scroll') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before triggering animation
          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [trigger, triggerOnce, threshold, delay]);

  // Define animation classes for each animation type
  const getAnimationClasses = (): string => {
    const animations: Record<AnimationType, { visible: string; hidden: string }> = {
      slideUp: {
        visible: 'opacity-100 translate-y-0',
        hidden: 'opacity-0 translate-y-6',
      },
      slideDown: {
        visible: 'opacity-100 translate-y-0',
        hidden: 'opacity-0 -translate-y-6',
      },
      slideLeft: {
        visible: 'opacity-100 translate-x-0',
        hidden: 'opacity-0 translate-x-6',
      },
      slideRight: {
        visible: 'opacity-100 translate-x-0',
        hidden: 'opacity-0 -translate-x-6',
      },
      fade: {
        visible: 'opacity-100',
        hidden: 'opacity-0',
      },
      scaleUp: {
        visible: 'opacity-100 scale-100',
        hidden: 'opacity-0 scale-95',
      },
      scaleDown: {
        visible: 'opacity-100 scale-100',
        hidden: 'opacity-0 scale-105',
      },
    };

    return isVisible ? animations[animation].visible : animations[animation].hidden;
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-${easing} ${getAnimationClasses()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
      }}>
      {children}
    </div>
  );
};

export default AnimateIn;
