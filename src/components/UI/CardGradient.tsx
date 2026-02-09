import { maxCardWidth } from '@/utils/spacingConstants';
import CTA from './CTA';

interface CardGradientProps {
  title: string;
  body: string;
  ctaText: string;
  ctaHref: string;
  className?: string;
}

const CardGradient = ({ title, body, ctaText, ctaHref, className = '' }: CardGradientProps) => {
  return (
    <div
      className={`bg-brand-dark rounded-xl p-8 md:p-12 max-w-3xl mx-auto ${maxCardWidth} ${className}`}>
      <p className='text-h4 font-semibold text-brand-primary mb-4'>{title}</p>
      <p className='text-body-lg text-brand-white mb-6'>{body}</p>
      <CTA href={ctaHref} variant='filled'>
        {ctaText}
      </CTA>
    </div>
  );
};

export default CardGradient;
