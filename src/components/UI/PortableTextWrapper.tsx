import React from 'react';
import { PortableText } from 'next-sanity';
import type { PortableTextComponents } from 'next-sanity';

interface PortableTextWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any; // Sanity-generated types have different nullability patterns than PortableTextBlock
  components: PortableTextComponents;
  className?: string;
  dataAttributes?: Record<string, string>;
}

/**
 * Wrapper component for PortableText rendering with consistent spacing between blocks.
 *
 * This component ensures that all Rich Text content across the site has consistent
 * paragraph/block spacing with intelligent handling of blank lines.
 *
 * Rich Text scenarios:
 * - Shift+Return (soft break): No extra spacing (same paragraph)
 * - Return (new paragraph): mt-2 spacing between paragraphs
 * - Return twice (blank line): Empty paragraph provides spacing, no margin added after
 *
 * Implementation details:
 * - Empty blocks are rendered as `<p></p>` (truly empty, no &nbsp;)
 * - CSS `[&>:empty]:min-h-[1lh]` gives empty elements height equal to one line
 * - CSS `[&>:not(:empty)+:not(:empty)]` adds mt-2 only between non-empty elements
 * - This prevents margin after blank lines while maintaining spacing between paragraphs
 *
 * Spacing logic:
 * ```
 * <p>Text</p>              ← No margin (first)
 * <p>More text</p>         ← mt-2 (non-empty after non-empty)
 * <p></p>                  ← No margin added (blank line)
 * <p>After blank</p>       ← No margin (after empty element)
 * ```
 *
 * Usage:
 * ```tsx
 * <PortableTextWrapper
 *   value={content}
 *   components={richTextComponents}
 *   className="prose prose-slate max-w-xl text-center"
 * />
 * ```
 */
const PortableTextWrapper = ({
  value,
  components,
  className = '',
  dataAttributes = {},
}: PortableTextWrapperProps) => {
  return (
    <div
      className={`[&>:not(:empty)+:not(:empty)]:mt-2 *:empty:min-h-lh ${className}`}
      {...dataAttributes}>
      <PortableText value={value} components={components} />
    </div>
  );
};

export default PortableTextWrapper;
