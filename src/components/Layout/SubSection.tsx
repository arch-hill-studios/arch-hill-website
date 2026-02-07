import React from 'react';
import Heading from '../Typography/Heading';
import { stegaClean } from 'next-sanity';
import {
  createSanityDataAttribute,
  type SanityLiveEditingProps,
  getTextAlignClass,
  type TextAlignment,
} from '../../utils/sectionHelpers';
import { resolveAlignment } from '../_blocks/shared/alignmentUtils';
import { anchorLinkScrollMarginTop } from '@/utils/spacingConstants';
import { parseColoredText } from '@/utils/textHelpers';

interface SubSectionProps extends SanityLiveEditingProps {
  children: React.ReactNode;
  className?: string;
  title: string; // Required for SubSections
  anchorId?: string; // ID for anchor linking
  inheritAlignment?: 'left' | 'center' | 'right';
  textAlign?: string; // NOTE: This field is currently not set in the CMS, but has been left here for the future in case we want to allow for section level text alignment control in the CMS
}

const SubSection = ({
  children,
  className = '',
  title,
  anchorId,
  documentId,
  documentType,
  titlePath,
  inheritAlignment,
  textAlign = 'inherit',
}: SubSectionProps) => {
  // Create data attribute for Sanity live editing
  const titleDataAttribute = createSanityDataAttribute(documentId, documentType, titlePath);

  // Resolve alignment using shared utility (same as other components)
  const cleanTextAlign = stegaClean(textAlign) || 'inherit';
  const resolved = resolveAlignment(cleanTextAlign, inheritAlignment);
  const effectiveTextAlign = (resolved || 'center') as TextAlignment;

  return (
    <section
      id={anchorId ? stegaClean(anchorId) : undefined}
      className={`${className} ${anchorLinkScrollMarginTop}`.trim()}>
      <div className={getTextAlignClass(effectiveTextAlign)}>
        <Heading
          level='h3' // Fixed h3 level for SubSections
          showMargin={false}
          {...titleDataAttribute}>
          {parseColoredText(stegaClean(title))}
        </Heading>
      </div>
      {children}
    </section>
  );
};

export default SubSection;
