import React from 'react';

export interface IconDefinition {
  // SVG path data for mask (used for gradients)
  svgPath: string;
  // Aspect ratio width:height (e.g., 23/15 for dumbell)
  aspectRatio: number;
  // Function that returns SVG JSX element with currentColor for solid colors
  renderSvg: (className: string) => React.ReactElement;
}
