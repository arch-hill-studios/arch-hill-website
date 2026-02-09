import React from 'react';
import { stegaClean } from 'next-sanity';
import type { StatementBlock } from '@/types/blocks';
import type { BlockProps } from '@/types/shared';
import { maxCardWidth } from '@/utils/spacingConstants';

interface StatementProps extends BlockProps<StatementBlock> {
  className?: string;
}

const Statement = ({ text, className = '' }: StatementProps) => {
  // Clean the value to remove Sanity's stega encoding
  const cleanText = stegaClean(text);

  // Don't render if no text is provided
  if (!cleanText) {
    return null;
  }

  return (
    <div className={`${maxCardWidth} flex flex-col items-center mx-auto ${className}`.trim()}>
      {/* Statement text */}
      <p className='text-body-2xl text-brand-primary text-center mb-4'>{cleanText}</p>

      {/* Underline */}
      <div className='w-1/3 h-[0.5px] opacity-50 bg-brand-primary' />
    </div>
  );
};

export default Statement;
