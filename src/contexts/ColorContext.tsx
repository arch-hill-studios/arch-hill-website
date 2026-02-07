// TEMPORARY_DEV: This context manages color scheme switching for testing purposes
// This entire file can be removed once final colors are decided

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Color scheme options
export const COLOR_SCHEMES = {
  option1: {
    name: 'Original',
    primary: '#ffb200',
    secondary: '#ff8400',
  },
  option2: {
    name: 'B',
    primary: '#ff8400',
    secondary: '#d06b00',
  },
  option3: {
    name: 'C',
    primary: '#ffb200',
    secondary: '#ac5900',
  },
  option4: {
    name: 'D',
    primary: '#ff6600',
    secondary: '#ff9d00',
  },
} as const;

export type ColorSchemeKey = keyof typeof COLOR_SCHEMES;

interface ColorContextType {
  currentScheme: ColorSchemeKey;
  setColorScheme: (scheme: ColorSchemeKey) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [currentScheme, setCurrentScheme] = useState<ColorSchemeKey>('option4');

  // Apply color scheme to CSS variables
  useEffect(() => {
    const scheme = COLOR_SCHEMES[currentScheme];
    document.documentElement.style.setProperty('--color-brand-primary', scheme.primary);
    document.documentElement.style.setProperty('--color-brand-secondary', scheme.secondary);

    // Store preference in localStorage for persistence
    localStorage.setItem('colorScheme', currentScheme);
  }, [currentScheme]);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('colorScheme') as ColorSchemeKey;
    if (saved && COLOR_SCHEMES[saved]) {
      setCurrentScheme(saved);
    }
  }, []);

  const setColorScheme = (scheme: ColorSchemeKey) => {
    setCurrentScheme(scheme);
  };

  return (
    <ColorContext.Provider value={{ currentScheme, setColorScheme }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};
