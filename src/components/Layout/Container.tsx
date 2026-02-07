import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
}

const Container = ({ children, textAlign = 'center' }: ContainerProps) => {
  return (
    <div
      className={`container max-w-360 mx-auto px-4 mb-20 md:mb-32 sm:px-20 text-${textAlign} overflow-visible`}>
      {children}
    </div>
  );
};

export default Container;
