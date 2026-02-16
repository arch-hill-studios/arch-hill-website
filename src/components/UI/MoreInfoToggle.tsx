import React from 'react';

interface MoreInfoToggleProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  expandLabel?: string;
  collapseLabel?: string;
  showOnDesktop?: boolean;
  alwaysCentered?: boolean;
}

const MoreInfoToggle = ({
  isExpanded,
  setIsExpanded,
  expandLabel = 'Read More',
  collapseLabel = 'Read Less',
  showOnDesktop = false,
  alwaysCentered = false,
}: MoreInfoToggleProps) => {
  return (
    <button
      type='button'
      onClick={() => setIsExpanded(!isExpanded)}
      className={`${showOnDesktop ? 'flex' : 'lg:hidden flex'} justify-center ${alwaysCentered ? '' : ' md:justify-start'} items-center gap-2 hover:font-semibold mt-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded`}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? 'Show less information' : 'Show more information'}>
      <span className='inline-block text-brand-primary'>
        {isExpanded ? collapseLabel : expandLabel}
      </span>
      <span className='text-brand-primary inline-flex items-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
            clipRule='evenodd'
          />
        </svg>
      </span>
    </button>
  );
};

export default MoreInfoToggle;
