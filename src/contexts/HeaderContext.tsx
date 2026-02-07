/**
 * HeaderContext - Controls header background opacity fade behavior
 *
 * PURPOSE:
 * This context manages whether the site header should have a scroll-based opacity fade effect
 * or maintain full opacity. It allows page-specific components (like Hero sections) to control
 * the header's visual behavior based on their presence and styling needs.
 *
 * HOW IT WORKS:
 * 1. HeaderProvider wraps the app layout and maintains `enableOpacityFade` state (default: false)
 * 2. Hero component sets `enableOpacityFade(true)` on mount, `false` on unmount
 * 3. Header component consumes this state to determine whether to apply scroll-based opacity
 *
 * KEY USE CASE - HERO SECTION INTEGRATION:
 * When a Hero section is present (typically on homepage):
 * - Hero has full-screen background images
 * - Header should start transparent to blend with Hero
 * - As user scrolls down, header background gradually fades in for readability
 * - This creates a seamless visual transition from Hero to page content
 *
 * KEY CONSUMERS:
 * - Header.tsx: Reads `enableOpacityFade` to decide whether to apply scroll-based opacity
 *   - If true: Header starts transparent, fades in background on scroll (0-30px scroll range)
 *   - If false: Header maintains full opacity at all times
 *
 * KEY PROVIDERS:
 * - Hero.tsx: Sets `enableOpacityFade(true)` when mounted (has Hero background)
 *   - Automatically disables on unmount (cleanup when navigating away)
 *
 * TYPICAL FLOW:
 * Homepage with Hero:
 * 1. Hero mounts → setEnableOpacityFade(true)
 * 2. Header starts transparent, blends with Hero background
 * 3. User scrolls → Header background opacity increases (0 → 1 over 30px)
 * 4. User navigates away → Hero unmounts → setEnableOpacityFade(false)
 *
 * Other pages without Hero:
 * 1. No Hero component → enableOpacityFade stays false
 * 2. Header shows with full opacity immediately
 * 3. No scroll-based opacity changes occur
 *
 * WHY THIS PATTERN:
 * - Avoids prop drilling through layout components
 * - Allows Hero to control header behavior without tight coupling
 * - Provides clean visual transition between transparent and opaque header states
 * - Maintains consistent header behavior across different page types
 */

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  enableOpacityFade: boolean;
  setEnableOpacityFade: (enable: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [enableOpacityFade, setEnableOpacityFade] = useState(false);

  return (
    <HeaderContext.Provider value={{ enableOpacityFade, setEnableOpacityFade }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
