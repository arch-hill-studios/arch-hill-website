import React from 'react';
import Heading from '../Typography/Heading';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { headerHeight, sitePaddingX } from '@/utils/spacingConstants';

interface PageHeroProps {
  title?: string | null;
  subtTitle?: string | null;
  documentId?: string;
  documentType?: string;
}

const PageHero = ({ title = null, subtTitle = null, documentId, documentType }: PageHeroProps) => {
  return (
    <div {...createSanityDataAttribute(documentId, documentType, 'heroImage')}>
      <section
        data-hero
        className={`bg-brand-gradient-dark-linear text-center overflow-hidden ${sitePaddingX} pb-12 mb-8 md:mb-12`}>
        {/* Header spacer */}
        <div className={`${headerHeight}`}></div>
        {title && (
          <Heading
            showMargin={!subtTitle}
            level='h1'
            className='text-h1 font-bold text-gradient-primary mt-6'>
            {title}
          </Heading>
        )}
        {subtTitle && (
          <p className='text-body-2xl text-brand-white mt-4 max-w-4xl mx-auto'>{subtTitle}</p>
        )}
      </section>
    </div>
  );
};

export default PageHero;
