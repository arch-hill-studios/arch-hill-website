import React from 'react';

/**
 * BodyTextPreview Component for Sanity Studio
 *
 * ⚠️  IMPORTANT: KEEP IN SYNC WITH GLOBALS.CSS ⚠️
 * These style values must match the corresponding @utility definitions in:
 * src/app/globals.css
 *
 * When updating typography styles:
 * 1. Update the @utility definitions in globals.css (for frontend rendering)
 * 2. Update the FONT_SCALE_BASE and multipliers in this file (for Sanity Studio previews)
 *
 * Both files must use identical base scale and multipliers to ensure consistency
 * between Sanity Studio previews and frontend display.
 */

interface BlockStyleProps {
  children: React.ReactNode;
}

interface BodyTextPreviewProps extends BlockStyleProps {
  value: string;
}

const BodyTextPreview = ({ children, value }: BodyTextPreviewProps) => {
  // ⚠️ This base scale must match --font-scale-base in src/app/globals.css
  // Currently set to 1rem in globals.css
  const FONT_SCALE_BASE = 1; // rem equivalent (1rem = 1.0 * 16px = 16px)
  const BASE_PX = 16; // Default browser font size
  const SCALE_PX = FONT_SCALE_BASE * BASE_PX;

  // ⚠️ These multipliers and line heights must match the @utility definitions in src/app/globals.css
  const getStyles = (styleType: string): React.CSSProperties => {
    switch (styleType) {
      case 'body-9xl':
        return {
          fontSize: `${SCALE_PX * 5}px`, // Desktop: calc(var(--font-scale-base) * 5)
          lineHeight: 1.1,
          fontWeight: 400,
          letterSpacing: `${SCALE_PX * -0.025}px`,
        };
      case 'body-8xl':
        return {
          fontSize: `${SCALE_PX * 4.5}px`, // Desktop: calc(var(--font-scale-base) * 4.5)
          lineHeight: 1.1,
          fontWeight: 400,
          letterSpacing: `${SCALE_PX * -0.025}px`,
        };
      case 'body-7xl':
        return {
          fontSize: `${SCALE_PX * 4}px`, // Desktop: calc(var(--font-scale-base) * 4)
          lineHeight: 1.15,
          fontWeight: 400,
          letterSpacing: `${SCALE_PX * -0.02}px`,
        };
      case 'body-6xl':
        return {
          fontSize: `${SCALE_PX * 3.5}px`, // Desktop: calc(var(--font-scale-base) * 3.5)
          lineHeight: 1.2,
          fontWeight: 400,
          letterSpacing: `${SCALE_PX * -0.02}px`,
        };
      case 'body-5xl':
        return {
          fontSize: `${SCALE_PX * 3}px`, // Desktop: calc(var(--font-scale-base) * 3)
          lineHeight: 1.25,
          fontWeight: 400,
          letterSpacing: `${SCALE_PX * -0.015}px`,
        };
      case 'body-4xl':
        return {
          fontSize: `${SCALE_PX * 2.625}px`, // Desktop: calc(var(--font-scale-base) * 2.625)
          lineHeight: 1.3,
          fontWeight: 400,
          letterSpacing: `${SCALE_PX * -0.01}px`,
        };
      case 'body-3xl':
        return {
          fontSize: `${SCALE_PX * 2.25}px`, // Desktop: calc(var(--font-scale-base) * 2.25)
          lineHeight: 1.4,
          fontWeight: 400,
          letterSpacing: '0',
        };
      case 'body-2xl':
        return {
          fontSize: `${SCALE_PX * 1.875}px`, // Desktop: calc(var(--font-scale-base) * 1.875)
          lineHeight: 1.5,
          fontWeight: 400,
          letterSpacing: '0',
        };
      case 'body-xl':
        return {
          fontSize: `${SCALE_PX * 1.625}px`, // Desktop: calc(var(--font-scale-base) * 1.625)
          lineHeight: 1.5,
          fontWeight: 400,
          letterSpacing: '0',
        };
      case 'body-lg':
        return {
          fontSize: `${SCALE_PX * 1.375}px`, // Desktop: calc(var(--font-scale-base) * 1.375)
          lineHeight: 1.625,
          fontWeight: 400,
          letterSpacing: '0',
        };
      case 'body-base':
        return {
          fontSize: `${SCALE_PX * 1.125}px`, // Desktop: calc(var(--font-scale-base) * 1.125)
          lineHeight: 1.625,
          fontWeight: 400,
          letterSpacing: '0',
        };
      case 'body-sm':
        return {
          fontSize: `${SCALE_PX * 0.9375}px`, // Desktop: calc(var(--font-scale-base) * 0.9375)
          lineHeight: 1.5,
          fontWeight: 400,
          letterSpacing: '0',
        };
      case 'body-xs':
        return {
          fontSize: `${SCALE_PX * 0.8125}px`, // Desktop: calc(var(--font-scale-base) * 0.8125)
          lineHeight: 1.5,
          fontWeight: 400,
          letterSpacing: '0',
        };
      default:
        return {};
    }
  };

  return <div style={getStyles(value)}>{children}</div>;
};

export default BodyTextPreview;
export type { BlockStyleProps };
