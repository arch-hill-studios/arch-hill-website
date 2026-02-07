import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  level: HeadingLevel;
  children: React.ReactNode;
  className?: string;
  showMargin?: boolean;
  asDiv?: boolean;
}

const Heading = ({
  level,
  children,
  className = '',
  showMargin = true,
  asDiv = false,
  ...rest
}: HeadingProps) => {
  // Get the text utility class for the heading level
  const getTextClass = (level: HeadingLevel) => {
    const textClasses = {
      h1: 'text-h1',
      h2: 'text-h2',
      h3: 'text-h3',
      h4: 'text-h4',
      h5: 'text-h5',
      h6: 'text-h6',
    };
    return textClasses[level];
  };

  const textClass = getTextClass(level);
  const marginClass = showMargin ? 'mb-4' : '';
  const combinedClassName = `${textClass} ${marginClass} ${className}`.trim();

  const HeadingTag = asDiv ? 'div' : level;

  return (
    <HeadingTag className={combinedClassName} {...rest}>
      {children}
    </HeadingTag>
  );
};

export default Heading;
