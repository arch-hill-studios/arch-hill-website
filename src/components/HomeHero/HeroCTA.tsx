import React from 'react';
import type { HOME_PAGE_HERO_QUERYResult } from '@/sanity/types';
import CTAList from '../UI/CTAList';
import { createSanityDataAttribute } from '../../utils/sectionHelpers';

interface HeroCTAProps {
  heroCallToActionList: NonNullable<HOME_PAGE_HERO_QUERYResult>['heroCallToActionList'];
  documentId: string;
  documentType: string;
}

const HeroCTA = ({ heroCallToActionList, documentId, documentType }: HeroCTAProps) => {
  if (!heroCallToActionList || heroCallToActionList.length === 0) return null;

  return (
    <div {...createSanityDataAttribute(documentId, documentType, 'heroCallToActionList')}>
      <CTAList ctaList={heroCallToActionList} alignment="flex-row" />
    </div>
  );
};

export default HeroCTA;