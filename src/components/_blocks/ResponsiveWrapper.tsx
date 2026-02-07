'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { ResponsiveWrapper as ResponsiveWrapperType } from '@/sanity/types';
import type { PageBuilderData } from '@/actions';
import { renderBlock } from '@/utils/blockRenderer';
import { client } from '@/sanity/lib/client';

interface ResponsiveWrapperProps extends Omit<ResponsiveWrapperType, '_type'> {
  _key?: string;
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
  pageBuilderData: PageBuilderData;
  alignment?: 'left' | 'center' | 'right';
}

const { projectId, dataset, stega } = client.config();
const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === 'string' ? stega.studioUrl : '',
};

const ResponsiveWrapper = (props: ResponsiveWrapperProps) => {
  const {
    displayMode = 'mobileOnly',
    content,
    className = '',
    documentId,
    documentType,
    fieldPathPrefix,
    pageBuilderData,
    alignment = 'center',
  } = props;

  const cleanDisplayMode = stegaClean(displayMode);

  // Don't render if no content
  if (!content || content.length === 0) {
    return null;
  }

  // Determine the Tailwind classes based on display mode
  const displayClass =
    cleanDisplayMode === 'mobileOnly'
      ? 'md:hidden' // Show on mobile, hide on desktop (md and up)
      : 'hidden md:block'; // Hide on mobile, show on desktop (md and up)

  return (
    <div className={`${displayClass} ${className}`}>
      {content.map((block, index) => {
        const blockPath = fieldPathPrefix
          ? `${fieldPathPrefix}.content[${index}]`
          : `content[${index}]`;

        return renderBlock(block, {
          documentId,
          documentType,
          blockPath,
          pageBuilderData,
          alignment,
          config: createDataAttributeConfig,
        });
      })}
    </div>
  );
};

export default ResponsiveWrapper;
