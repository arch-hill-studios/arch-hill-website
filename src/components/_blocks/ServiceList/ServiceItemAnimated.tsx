'use client';

import React, { useEffect, useRef, useState } from 'react';

type Variant = 'red' | 'blue';

interface AnimationClasses {
  title: string;
  titleStyle: React.CSSProperties;
  image: string;
  imageStyle: React.CSSProperties;
  card: string;
  cardStyle: React.CSSProperties;
  description: string;
  descriptionStyle: React.CSSProperties;
  pricing: string;
  pricingStyle: React.CSSProperties;
}

interface ServiceItemAnimatedProps {
  variant: Variant;
  children: (animation: AnimationClasses, containerRef: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const ServiceItemAnimated = ({ variant, children }: ServiceItemAnimatedProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSkipAnimation(true);
      setIsVisible(true);
    }
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (skipAnimation) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [skipAnimation]);

  const isRed = variant === 'red';

  // If skipping animation, return no-op classes
  if (skipAnimation) {
    const noOp: AnimationClasses = {
      title: '',
      titleStyle: {},
      image: '',
      imageStyle: {},
      card: '',
      cardStyle: {},
      description: '',
      descriptionStyle: {},
      pricing: '',
      pricingStyle: {},
    };
    return <>{children(noOp, containerRef)}</>;
  }

  // --- Title animation ---
  // Both desktop and mobile: fade in + slide down slightly
  const titleClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-2.5';

  // --- Card animation ---
  // Desktop: slide from its side (red=left, blue=right) + scale
  // Mobile: slide up + scale
  const cardClasses = isVisible
    ? 'opacity-100 translate-y-0 lg:translate-y-0 translate-x-0 lg:translate-x-0 scale-100'
    : isRed
      ? 'opacity-0 translate-y-5 lg:translate-y-0 lg:-translate-x-8 scale-[0.97]'
      : 'opacity-0 translate-y-5 lg:translate-y-0 lg:translate-x-8 scale-[0.97]';

  // --- Image animation ---
  // Desktop: slide from opposite side of card + blur
  // Mobile: scale up + fade (no horizontal slide)
  const imageClasses = isVisible
    ? 'opacity-100 translate-x-0 lg:translate-x-0 scale-100 lg:scale-100 blur-none'
    : isRed
      ? 'opacity-0 scale-[0.97] lg:scale-100 lg:translate-x-8 blur-sm'
      : 'opacity-0 scale-[0.97] lg:scale-100 lg:-translate-x-8 blur-sm';

  // --- Description animation ---
  const descriptionClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-2.5';

  // --- Pricing animation ---
  const pricingClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-2.5';

  const animation: AnimationClasses = {
    title: `transition-[opacity,transform] ${titleClasses}`,
    titleStyle: {
      transitionDuration: '600ms',
      transitionTimingFunction: EASING,
      transitionDelay: '100ms',
    },
    image: `transition-[opacity,transform,filter] ${imageClasses}`,
    imageStyle: {
      transitionDuration: '700ms',
      transitionTimingFunction: EASING,
      transitionDelay: '150ms',
    },
    card: `transition-[opacity,transform] ${cardClasses}`,
    cardStyle: {
      transitionDuration: '700ms',
      transitionTimingFunction: EASING,
      transitionDelay: '0ms',
    },
    description: `transition-[opacity,transform] ${descriptionClasses}`,
    descriptionStyle: {
      transitionDuration: '500ms',
      transitionTimingFunction: EASING,
      transitionDelay: '400ms',
    },
    pricing: `transition-[opacity,transform] ${pricingClasses}`,
    pricingStyle: {
      transitionDuration: '500ms',
      transitionTimingFunction: EASING,
      transitionDelay: '550ms',
    },
  };

  return <>{children(animation, containerRef)}</>;
};

export default ServiceItemAnimated;
