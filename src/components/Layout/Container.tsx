import { sitePaddingX } from '@/utils/spacingConstants';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
}

const Container = ({ children, textAlign = 'center' }: ContainerProps) => {
  return (
    <div className={`mx-auto mb-28 md:mb-36 text-${textAlign} overflow-visible`}>{children}</div>
  );
};

export default Container;
