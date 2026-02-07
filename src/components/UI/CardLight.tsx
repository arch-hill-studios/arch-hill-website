import React from 'react';
import { IconType } from 'react-icons';

interface CardLightProps {
  title?: string;
  children: React.ReactNode;
  icon?: IconType;
  className?: string;
  showBorder?: boolean;
  id?: string;
}

const CardLight = ({
  title = '',
  children,
  icon: Icon,
  className = '',
  showBorder = false,
  id,
}: CardLightProps) => {
  return (
    <div
      id={id}
      className={`bg-brand-charcoal-light rounded-xl p-4 md:p-8 text-center ${showBorder ? 'border-4 border-brand-primary' : ''} ${className}`}>
      <div className='flex flex-col justify-center md:justify-start items-center gap-2 md:gap-4'>
        {Icon ? <Icon className='w-8 h-8 text-brand-secondary' /> : null}
        <p className='text-h4 text-gradient-primary mb-2'>{title}</p>
      </div>
      {children}
    </div>
  );
};

export default CardLight;
