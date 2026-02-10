import React from 'react';

interface ScrollIndicatorProps {
  className?: string;
}

const ScrollIndicator = ({ className = '' }: ScrollIndicatorProps) => {
  const handleScrollDown = () => {
    // Scroll to the next section after the hero
    const heroElement = document.querySelector('[data-hero]') as HTMLElement;
    if (heroElement) {
      const nextElement = heroElement.nextElementSibling as HTMLElement;
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: scroll by viewport height
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    }
  };

  return (
    <button
      onClick={handleScrollDown}
      className={`
        group flex flex-col items-center justify-center
        transition-all duration-300 ease-in-out
        text-brand-primary-hover hover:text-brand-white
        cursor-pointer
        ${className}
      `}
      aria-label='Scroll down to content'>
      {/* Simple downward arrow */}
      <svg
        width='24'
        height='30'
        viewBox='0 0 24 30'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='
          w-6 h-7.5
          animate-bounce
          transition-all duration-300
          group-hover:translate-y-1
        '>
        <path
          d='M12 5 L12 23 M12 23 L6 17 M12 23 L18 17'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </button>
  );
};

export default ScrollIndicator;
