'use client';

import React from 'react';
import { stegaClean } from 'next-sanity';
import type { NestedBlock } from '@/types/blocks';
import type { PageBuilderData } from '@/actions';
import { createSanityDataAttribute, type SanityLiveEditingProps } from '../../utils/sectionHelpers';
import { contentBlockBottomSpacing } from '@/utils/spacingConstants';
import { renderBlock } from '@/utils/blockRenderer';
import { client } from '@/sanity/lib/client';

const { projectId, dataset, stega } = client.config();
const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === 'string' ? stega.studioUrl : '',
};

interface TwoColumnLayoutProps extends Omit<SanityLiveEditingProps, 'titlePath' | 'subtitlePath'> {
  leftColumn?: NestedBlock[];
  rightColumn?: NestedBlock[];
  verticallyCenter?: boolean;
  columnSplit?: '50/50' | '60/40' | '40/60' | '70/30' | '30/70';
  className?: string;
  pathPrefix?: string;
  pageBuilderData: PageBuilderData;
  alignment?: 'left' | 'center' | 'right';
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftColumn = [],
  rightColumn = [],
  verticallyCenter = false,
  columnSplit = '50/50',
  className = '',
  documentId,
  documentType,
  pathPrefix,
  pageBuilderData,
  alignment = 'center',
}) => {
  // Don't render if both columns are empty
  if (!leftColumn?.length && !rightColumn?.length) {
    return null;
  }

  // Clean the values to remove Sanity's stega encoding
  const cleanVerticallyCenter = stegaClean(verticallyCenter);
  const cleanColumnSplit = stegaClean(columnSplit) || '50/50';

  // Map column split ratios to Tailwind grid column classes
  const getGridColumnClasses = (split: string): { leftCol: string; rightCol: string } => {
    switch (split) {
      case '60/40':
        return { leftCol: 'lg:col-span-6', rightCol: 'lg:col-span-4' };
      case '40/60':
        return { leftCol: 'lg:col-span-4', rightCol: 'lg:col-span-6' };
      case '70/30':
        return { leftCol: 'lg:col-span-7', rightCol: 'lg:col-span-3' };
      case '30/70':
        return { leftCol: 'lg:col-span-3', rightCol: 'lg:col-span-7' };
      case '50/50':
      default:
        return { leftCol: 'lg:col-span-1', rightCol: 'lg:col-span-1' };
    }
  };

  const gridClasses = getGridColumnClasses(cleanColumnSplit);

  // Render a single block within a column using shared renderBlock utility
  const renderColumnBlock = (block: NestedBlock, columnPath: string, isLastInColumn: boolean) => {
    const blockPath = `${columnPath}[_key=="${block._key}"]`;
    const marginClass = !isLastInColumn ? contentBlockBottomSpacing : '';

    const blockElement = renderBlock(block, {
      documentId,
      documentType,
      blockPath,
      pageBuilderData,
      alignment,
      config: createDataAttributeConfig,
    });

    if (!blockElement) return null;

    return (
      <div key={block._key} className={marginClass}>
        {blockElement}
      </div>
    );
  };

  // Create data attributes for Sanity live editing
  const leftColumnDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, `${pathPrefix}.leftColumn`)
    : {};
  const rightColumnDataAttribute = pathPrefix
    ? createSanityDataAttribute(documentId, documentType, `${pathPrefix}.rightColumn`)
    : {};

  // Determine column alignment classes
  const columnAlignmentClass = cleanVerticallyCenter ? 'flex flex-col justify-center' : '';

  // Determine the total number of grid columns needed based on the split
  const totalGridCols = cleanColumnSplit === '50/50' ? 'lg:grid-cols-2' : 'lg:grid-cols-10';

  return (
    <div className={`grid grid-cols-1 ${totalGridCols} gap-8 md:gap-18 ${className}`.trim()}>
      {/* Left Column */}
      <div
        className={`${gridClasses.leftCol} ${columnAlignmentClass}`.trim()}
        {...leftColumnDataAttribute}>
        {leftColumn.map((block, index) =>
          renderColumnBlock(block, `${pathPrefix}.leftColumn`, index === leftColumn.length - 1)
        )}
      </div>

      {/* Right Column */}
      <div
        className={`${gridClasses.rightCol} ${columnAlignmentClass}`.trim()}
        {...rightColumnDataAttribute}>
        {rightColumn.map((block, index) =>
          renderColumnBlock(block, `${pathPrefix}.rightColumn`, index === rightColumn.length - 1)
        )}
      </div>
    </div>
  );
};

export default TwoColumnLayout;
