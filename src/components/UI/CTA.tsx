import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiExternalLink } from 'react-icons/fi';

type BaseCTAProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'filled' | 'outline-light' | 'outline-dark' | 'text-link' | 'secondary';
  shortOnMobile?: boolean;
};

type LinkCTAProps = BaseCTAProps & {
  as?: 'link';
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

type ButtonCTAProps = BaseCTAProps & {
  as: 'button';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

type CTAProps = LinkCTAProps | ButtonCTAProps;

const getVariantStyles = (
  variant: 'filled' | 'outline-light' | 'outline-dark' | 'text-link' | 'secondary' = 'filled',
  disabled: boolean = false,
  shortOnMobile: boolean = false,
) => {
  // Disabled/read-only styling - applies to all variants
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  // Text link variant - no padding/borders, just text styling with chevron
  if (variant === 'text-link') {
    return `font-heading inline-flex items-center gap-2 text-lg tracking-[2px] hover:text-brand-white transition-colors duration-200 cursor-pointer group ${disabledStyles}`.trim();
  }

  // Height styles
  const heightStyles = shortOnMobile ? 'py-1 md:py-3' : 'py-3 min-h-[56px]';

  // Note that the min-h-[56px] is so that regular buttons become the same height as the CTA Email Button, which needs more internal space because of the icon.
  const baseStyles = `inline-flex uppercase items-center justify-center px-8 ${heightStyles} font-heading tracking-[2px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer`;

  if (variant === 'outline-light') {
    // Outline button on light background - brand border and text, fills on hover
    return `${baseStyles} border border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary hover:text-brand-white focus:ring-brand-primary ${disabledStyles}`.trim();
  }

  if (variant === 'outline-dark') {
    // Outline button on dark background - semi-transparent with backdrop blur
    return `${baseStyles} bg-black/40 backdrop-blur-sm border border-brand-primary text-brand-white hover:bg-brand-white hover:text-brand-primary focus:ring-brand-primary ${disabledStyles}`.trim();
  }

  if (variant === 'secondary') {
    // Secondary button - gray background for less prominent actions
    return `${baseStyles} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 ${disabledStyles}`.trim();
  }

  // Default to filled variant with brand primary
  return `${baseStyles} bg-brand-primary text-brand-white hover:bg-brand-primary-hover focus:ring-brand-primary ${disabledStyles}`.trim();
};

const CTA = (props: CTAProps) => {
  const { children, className = '', variant = 'filled', shortOnMobile, ...restProps } = props;

  // Check if button is disabled (only applicable for button type)
  const isDisabled =
    props.as === 'button' ? (restProps as ButtonCTAProps).disabled || false : false;

  const combinedClassName =
    `${getVariantStyles(variant, isDisabled, shortOnMobile)} ${className}`.trim();

  // Determine if this is an external link for text-link variant
  let isExternal = false;
  if (props.as !== 'button') {
    const { href } = restProps as LinkCTAProps;
    isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  }

  // For text-link variant, wrap content with appropriate icon
  const content =
    variant === 'text-link' ? (
      <>
        {children}
        {isExternal ? (
          <FiExternalLink
            className='transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 text-xl'
            strokeWidth={2.5}
          />
        ) : (
          <FiChevronRight
            className='transition-transform duration-200 group-hover:translate-x-1 text-xl'
            strokeWidth={3}
          />
        )}
      </>
    ) : (
      children
    );

  if (props.as === 'button') {
    const { onClick, type = 'button', disabled } = restProps as ButtonCTAProps;
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={combinedClassName}>
        {content}
      </button>
    );
  }

  // Default to link behavior
  const { href, target, rel, onClick } = restProps as LinkCTAProps;

  // Use Next.js Link for internal links, regular anchor for external links or when target="_blank"
  const shouldUseAnchor = isExternal || target === '_blank';

  if (shouldUseAnchor) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={combinedClassName}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={combinedClassName}>
      {content}
    </Link>
  );
};

export default CTA;
