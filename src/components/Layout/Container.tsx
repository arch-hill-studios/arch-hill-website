import React from 'react';
import { sitePaddingX } from '@/utils/spacingConstants';

interface ContainerProps {
  children: React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
}

const Container = ({ children, textAlign = 'center' }: ContainerProps) => {
  return (
    <div
      className={`container max-w-360 mx-auto ${sitePaddingX} mb-20 md:mb-32 text-${textAlign} overflow-visible`}>
      {children}
    </div>
  );
};

export default Container;
