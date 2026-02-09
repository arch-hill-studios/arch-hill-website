import React from 'react';
import { FaStar } from 'react-icons/fa';
import { ICON_DEFINITIONS, type CustomIconKey } from './iconDefinitions/index';

export type { CustomIconKey };

export interface CustomIconProps {
  iconKey: CustomIconKey;
  /**
   * Width of the icon in rem units (e.g., 3 = 3rem) for desktop
   * Height will auto-calculate based on the icon's aspect ratio
   */
  width: number;
  /**
   * Optional mobile width in rem units (e.g., 2 = 2rem)
   * When provided, icon will use this width on mobile screens and 'width' on desktop
   * If not provided, 'width' will be used on all screen sizes
   */
  mobileWidth?: number;
  /**
   * Controls the icon color - supports:
   * - Solid colors: 'text-brand-primary', 'text-brand-secondary', 'text-brand-dark', 'text-brand-white'
   * - Gradients: 'gradient-primary', 'gradient-dark-linear', 'gradient-dark-diag', 'gradient-dark-radial', 'gradient-metal', 'gradient-firey'
   * - Legacy text-gradient classes also supported: 'text-gradient-primary', etc.
   */
  colorClassName?: string;
  /**
   * Optional additional className for the container (e.g., for margin, display properties)
   * Do NOT use this for width/height - use the width prop instead
   */
  className?: string;
}

/**
 * CustomIcon component for rendering custom SVG icons
 *
 * Features:
 * - Size control via width prop (in rem units)
 * - Responsive sizing with optional mobileWidth
 * - Automatic aspect ratio maintenance
 * - Color control via Tailwind text/gradient classes
 * - Falls back to red star if icon not found
 *
 * @example
 * // Basic usage - 3rem wide on all screens
 * <CustomIcon iconKey="dumbell" width={3} />
 *
 * @example
 * // Responsive - 2rem on mobile, 4rem on desktop
 * <CustomIcon iconKey="dumbell" width={4} mobileWidth={2} />
 *
 * @example
 * // With solid brand color - 4rem wide
 * <CustomIcon iconKey="dumbell" width={4} colorClassName="text-brand-primary" />
 *
 * @example
 * // With gradient - 6rem wide
 * <CustomIcon iconKey="dumbell" width={6} colorClassName="text-gradient-primary" />
 */
const CustomIcon = ({
  iconKey,
  width,
  mobileWidth,
  colorClassName = 'text-brand-primary',
  className = '',
}: CustomIconProps) => {
  const iconDef = ICON_DEFINITIONS[iconKey];

  // If icon not found, render red star as fallback
  if (!iconDef) {
    console.warn(`CustomIcon: Icon "${iconKey}" not found. Rendering fallback icon.`);
    const fallbackStyle = mobileWidth
      ? ({
          '--icon-width-mobile': `${mobileWidth}rem`,
          '--icon-width-desktop': `${width}rem`,
        } as React.CSSProperties)
      : { width: `${width}rem`, height: 'auto' };
    return (
      <FaStar
        className={`text-red-500 ${mobileWidth ? 'w-(--icon-width-mobile) md:w-(--icon-width-desktop)' : ''}`}
        style={fallbackStyle}
      />
    );
  }

  // Calculate heights based on widths to maintain aspect ratio
  const heightRem = width / iconDef.aspectRatio;
  const mobileHeightRem = mobileWidth ? mobileWidth / iconDef.aspectRatio : undefined;

  // Map gradient names to CSS custom properties
  const gradientMap: Record<string, string> = {
    'gradient-primary': 'var(--background-image-brand-gradient-primary)',
    'gradient-dark-linear': 'var(--background-image-brand-gradient-dark-linear)',
    'gradient-dark-diag': 'var(--background-image-brand-gradient-dark-diag)',
    'gradient-dark-radial': 'var(--background-image-brand-gradient-dark-radial)',
    'gradient-metal': 'var(--background-image-brand-gradient-metal)',
    'gradient-firey': 'var(--background-image-brand-gradient-firey)',
  };

  // Check if using a gradient (either new format 'gradient-X' or legacy 'text-gradient-X')
  const isGradient =
    colorClassName.startsWith('gradient-') || colorClassName.startsWith('text-gradient-');

  // Build responsive styles
  const containerStyle: React.CSSProperties = mobileWidth
    ? ({
        '--icon-width-mobile': `${mobileWidth}rem`,
        '--icon-height-mobile': `${mobileHeightRem}rem`,
        '--icon-width-desktop': `${width}rem`,
        '--icon-height-desktop': `${heightRem}rem`,
      } as React.CSSProperties)
    : {
        width: `${width}rem`,
        height: `${heightRem}rem`,
      };

  const responsiveClasses = mobileWidth
    ? 'w-[var(--icon-width-mobile)] h-[var(--icon-height-mobile)] md:w-[var(--icon-width-desktop)] md:h-[var(--icon-height-desktop)]'
    : '';

  // For gradients, apply gradient to wrapper and use mask for the SVG shape
  if (isGradient) {
    // Get the gradient value - support both new and legacy formats
    let gradientValue: string | undefined;

    if (colorClassName.startsWith('gradient-')) {
      // New format: use the gradient map
      gradientValue = gradientMap[colorClassName];
    } else if (colorClassName.startsWith('text-gradient-')) {
      // Legacy format: apply the text-gradient class (uses background-clip: text from globals.css)
      // Convert to simple gradient format
      const gradientName = colorClassName.replace('text-gradient-', 'gradient-');
      gradientValue = gradientMap[gradientName];
    }

    return (
      <div
        className={`inline-block ${responsiveClasses} ${className}`.trim()}
        style={containerStyle}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: gradientValue,
            WebkitMask: `url("data:image/svg+xml,${encodeURIComponent(iconDef.svgPath)}") center / contain no-repeat`,
            mask: `url("data:image/svg+xml,${encodeURIComponent(iconDef.svgPath)}") center / contain no-repeat`,
          }}
        />
      </div>
    );
  }

  // For solid colors, use the normal SVG with currentColor
  return (
    <div className={`inline-block ${responsiveClasses} ${className}`.trim()} style={containerStyle}>
      {iconDef.renderSvg(colorClassName)}
    </div>
  );
};

export default CustomIcon;
