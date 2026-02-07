// Icon definitions with their SVG paths and aspect ratios
// Each icon should use currentColor or gradient fills to enable color control

export { type IconDefinition } from './types';
export { dumbell } from './dumbell';
export { progressGraph } from './progressGraph';
export { target } from './target';
export { clock } from './clock';
export { flame } from './flame';
export { gear } from './gear';
export { questionMan } from './questionMan';

import { dumbell } from './dumbell';
import { progressGraph } from './progressGraph';
import { target } from './target';
import { clock } from './clock';
import { flame } from './flame';
import { gear } from './gear';
import { questionMan } from './questionMan';

export const ICON_DEFINITIONS = {
  dumbell,
  progressGraph,
  target,
  clock,
  flame,
  gear,
  questionMan,
} as const;

export type CustomIconKey = keyof typeof ICON_DEFINITIONS;
