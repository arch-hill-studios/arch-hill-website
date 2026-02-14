/**
 * HeaderContext - Controls header background opacity fade behavior
 *
 * PURPOSE:
 * This context manages whether the site header should have a scroll-based opacity fade effect
 * or maintain full opacity. It allows page-specific components (like Hero sections) to control
 * the header's visual behavior based on their presence and styling needs.
 *
 * HOW IT WORKS:
 * 1. HeaderProvider wraps the app layout and maintains `enableOpacityFade` state (default: null)
 * 2. Hero component sets `enableOpacityFade(true)` on mount, `false` on unmount
 * 3. Header component consumes this state to determine whether to apply scroll-based opacity
 *
 * STATE VALUES:
 * - null: Undetermined (initial). Header keeps start state and waits for Hero to mount.
 *   If no Hero mounts within a timeout, Header falls back to false.
 * - true: Hero present. Header starts transparent and fades in on scroll.
 * - false: No Hero. Header shows with full opacity immediately.
 *
 * WHY NULL INITIAL STATE:
 * On page refresh, Header hydrates before Hero (it's higher in the component tree).
 * If the initial state were `false`, Header would immediately assume "no hero" and
 * flash to end state before Hero can set it to `true`. Using `null` prevents this
 * race condition — Header waits in start state until the state is determined.
 *
 * TYPICAL FLOW:
 * Homepage with Hero:
 * 1. Page loads → enableOpacityFade = null (Header waits in start state)
 * 2. Hero mounts → setEnableOpacityFade(true)
 * 3. Header starts transparent, blends with Hero background
 * 4. User scrolls → Header background opacity increases
 * 5. User navigates away → Hero unmounts → setEnableOpacityFade(false)
 *
 * Other pages without Hero:
 * 1. Page loads → enableOpacityFade = null (Header waits in start state)
 * 2. No Hero mounts → Header's fallback timeout sets enableOpacityFade to false
 * 3. Header shows with full opacity
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
  enableOpacityFade: boolean | null;
  setEnableOpacityFade: (enable: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [enableOpacityFade, setEnableOpacityFade] = useState<boolean | null>(null);

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
