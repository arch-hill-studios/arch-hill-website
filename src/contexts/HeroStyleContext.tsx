// TEMPORARY_DEV: This context manages hero style switching for testing purposes
// This entire file can be removed once testing is complete

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Hero style options matching Sanity schema
export const HERO_STYLES = {
  default: {
    name: 'Default',
    value: 'default',
  },
  'background-images': {
    name: 'Background Images',
    value: 'background-images',
  },
  video: {
    name: 'Video',
    value: 'video',
  },
} as const;

export type HeroStyleKey = keyof typeof HERO_STYLES;

interface HeroStyleContextType {
  currentStyle: HeroStyleKey;
  setHeroStyle: (style: HeroStyleKey) => void;
  isOverrideActive: boolean;
}

const HeroStyleContext = createContext<HeroStyleContextType | undefined>(undefined);

export const HeroStyleProvider = ({ children }: { children: ReactNode }) => {
  const [currentStyle, setCurrentStyle] = useState<HeroStyleKey>('default');
  const [isOverrideActive, setIsOverrideActive] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('heroStyle') as HeroStyleKey;
    if (saved && HERO_STYLES[saved]) {
      setCurrentStyle(saved);
      setIsOverrideActive(true);
    }
  }, []);

  const setHeroStyle = (style: HeroStyleKey) => {
    setCurrentStyle(style);
    setIsOverrideActive(true);
    // Store preference in localStorage for persistence
    localStorage.setItem('heroStyle', style);
  };

  return (
    <HeroStyleContext.Provider value={{ currentStyle, setHeroStyle, isOverrideActive }}>
      {children}
    </HeroStyleContext.Provider>
  );
};

export const useHeroStyle = () => {
  const context = useContext(HeroStyleContext);
  if (context === undefined) {
    throw new Error('useHeroStyle must be used within a HeroStyleProvider');
  }
  return context;
};
