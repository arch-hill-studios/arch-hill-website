import CTA from './CTA';

type CTAButtonClientProps = {
  children: React.ReactNode;
  variant?: 'filled' | 'outline-light' | 'outline-dark' | 'text-link';
  onClick: () => void;
  className?: string;
  shortOnMobile?: boolean;
};

const CTAButtonClient = ({
  children,
  variant,
  onClick,
  className,
  shortOnMobile,
}: CTAButtonClientProps) => {
  return (
    <CTA
      as='button'
      variant={variant}
      onClick={onClick}
      className={className}
      shortOnMobile={shortOnMobile}>
      {children}
    </CTA>
  );
};

export default CTAButtonClient;
