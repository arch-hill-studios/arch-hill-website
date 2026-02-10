'use client';

import React from 'react';

interface MenuButtonProps {
  isMenuOpen?: boolean;
  onClick: () => void;
  className?: string;
  ariaControls?: string;
  showOnDesktop?: boolean;
}

const MenuButton = ({
  isMenuOpen = false,
  onClick,
  className = '',
  ariaControls,
  showOnDesktop = true,
}: MenuButtonProps) => {
  const desktopHiddenClass = showOnDesktop ? '' : 'xl:hidden';

  return (
    <button
      onClick={onClick}
      className={`flex ${desktopHiddenClass} flex-col justify-center items-center w-8 h-8 cursor-pointer focus:outline-none group ${className}`}
      aria-label={`${isMenuOpen ? 'Close' : 'Open'} navigation menu`}
      aria-expanded={isMenuOpen}
      aria-controls={ariaControls}>
      {/* Line 1 - rotates to form top-left to bottom-right of X */}
      <span
        className={`block w-6 h-0.5 bg-brand-white transition-all duration-300 ${
          isMenuOpen ? 'translate-y-2 rotate-45' : ''
        }`}
      />
      {/* Line 2 - fades out */}
      <span
        className={`block w-6 h-0.5 bg-brand-white transition-all duration-300 mt-1.5 ${
          isMenuOpen ? 'opacity-0' : ''
        }`}
      />
      {/* Line 3 - rotates to form bottom-left to top-right of X */}
      <span
        className={`block w-6 h-0.5 bg-brand-white transition-all duration-300 mt-1.5 ${
          isMenuOpen ? '-translate-y-2 -rotate-45' : ''
        }`}
      />
    </button>
  );
};

export default MenuButton;
