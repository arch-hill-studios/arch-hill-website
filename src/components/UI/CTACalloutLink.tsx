import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { maxCardWidth } from '@/utils/spacingConstants';

type CTACalloutLinkProps = {
  heading?: string;
  text?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  href: string;
  target?: string;
  rel?: string;
  className?: string;
};

const CTACalloutLink = ({
  heading,
  text,
  image,
  href,
  target,
  rel,
  className = '',
}: CTACalloutLinkProps) => {
  // Determine if this is an external link
  const isExternal =
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    target === '_blank';

  // Choose appropriate icon
  const LinkIcon = isExternal ? FaExternalLinkAlt : FaArrowRight;

  const content = (
    <div
      className={`
        bg-brand-white-dark 
        rounded-lg    
        shadow-sm 
        py-3
        px-4
        [@media(min-width:400px)]:py-4
        [@media(min-width:400px)]:px-6
        sm:py-6
        sm:px-8 
        w-full 
        ${maxCardWidth}  
        m-auto  
        hover:bg-brand-primary/5 
        hover:shadow-md 
        transition-all 
        duration-200 
        cursor-pointer
        group
        ${className}
      `.trim()}>
      <div className='flex flex-row justify-center items-center gap-4 [@media(min-width:400px)]:gap-6 md:gap-8'>
        {/* Image */}
        {image && (
          <div className='flex-shrink-0'>
            <div className='w-16 h-16 [@media(min-width:400px)]:w-24 [@media(min-width:400px)]:h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center'>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width || 64}
                height={image.height || 64}
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        )}

        {/* Content */}
        {(heading || text) && (
          <div className='flex-grow text-left min-w-0'>
            {heading && (
              <div className='font-semibold group-hover:underline text-body-base [@media(min-width:400px)]:text-body-lg mb-1 leading-tight'>
                {heading}
              </div>
            )}
            {text && (
              <p className='text-subtle text-body-sm [@media(min-width:400px)]:text-body-base leading-snug [@media(min-width:400px)]:leading-relaxed whitespace-pre-line'>
                {text}
              </p>
            )}
          </div>
        )}

        {/* Link Icon - Consistent style with hover circle */}
        <div className='flex-shrink-0 flex items-center justify-center'>
          <div className='group-hover:bg-brand-primary p-3 rounded-full transition-all duration-200 group-hover:shadow-sm'>
            <LinkIcon className='w-5 h-5 text-brand-secondary group-hover:text-brand-white transition-colors duration-200' />
          </div>
        </div>
      </div>
    </div>
  );

  // Render as Next.js Link for internal links, regular anchor for external
  if (isExternal) {
    return (
      <a href={href} target={target} rel={rel}>
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
};

export default CTACalloutLink;
