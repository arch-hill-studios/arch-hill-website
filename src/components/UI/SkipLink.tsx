import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink = ({ href, children, className = '' }: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-brand-white text-black px-4 py-2 rounded shadow-lg z-50
        font-medium text-body-base underline
        focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2
        ${className}
      `}>
      {children}
    </a>
  );
};

export default SkipLink;
