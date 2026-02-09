import React from 'react';

type ColorScheme = 'orange-white' | 'white-orange';

/**
 * Parses a string with color markers {text} and returns JSX elements.
 * Preserves spacing and line breaks.
 *
 * @param text - The string to parse (e.g., "Welcome to {My} Company")
 * @param colorScheme - The color scheme to use:
 *   - 'orange-white' (default): Default text is brand primary, {tagged} text is white
 *   - 'white-orange': Default text is white, {tagged} text is brand primary
 * @returns Array of React elements with appropriate color classes
 *
 * @example
 * // Primary default, white tagged
 * parseColoredText("Welcome to {My} Company", 'orange-white')
 * // Renders: "Welcome to " (primary) + "My" (white) + " Company" (primary)
 *
 * @example
 * // White default, primary tagged
 * parseColoredText("Professional {Development} Services", 'white-orange')
 * // Renders: "Professional " (white) + "Development" (primary) + " Services" (white)
 */
export const parseColoredText = (
  text: string,
  colorScheme: ColorScheme = 'orange-white',
): React.ReactNode[] => {
  if (!text) return [];

  // Split by {text} pattern while keeping the matched groups
  const parts = text.split(/(\{[^}]+\})/g);

  // Determine colors based on scheme
  const defaultColor =
    colorScheme === 'orange-white' ? 'text-brand-primary' : 'text-brand-white';
  const taggedColor = colorScheme === 'orange-white' ? 'text-brand-white' : 'text-brand-primary';

  return parts.map((part, i) => {
    // Skip empty strings but keep them in the array to maintain proper spacing
    if (!part) return null;

    // Check if this part is wrapped in curly braces
    const isTagged = part.startsWith('{') && part.endsWith('}');
    // For tagged content, trim to remove unwanted spaces before/after the braces
    const content = isTagged ? part.slice(1, -1).trim() : part;
    const colorClass = isTagged ? taggedColor : defaultColor;

    // Handle line breaks - split by newlines to preserve them
    const lines = content.split('\n');

    // Helper function to preserve whitespace by replacing spaces with non-breaking spaces
    // only at the start/end of strings to prevent whitespace collapse
    const preserveWhitespace = (str: string) => {
      if (!str) return str;

      // Replace leading spaces with non-breaking spaces
      const leadingSpaces = str.match(/^\s+/);
      const trailingSpaces = str.match(/\s+$/);
      let result = str;

      if (leadingSpaces) {
        result = leadingSpaces[0].replace(/ /g, '\u00A0') + result.slice(leadingSpaces[0].length);
      }
      if (trailingSpaces) {
        result =
          result.slice(0, -trailingSpaces[0].length) + trailingSpaces[0].replace(/ /g, '\u00A0');
      }

      return result;
    };

    // If no newlines, return a simple span
    if (lines.length === 1) {
      return (
        <span key={i} className={colorClass}>
          {preserveWhitespace(content)}
        </span>
      );
    }

    // If there are newlines, we need to wrap each line separately
    // and add <br> elements between them
    return (
      <React.Fragment key={i}>
        {lines.map((line, lineIndex) => {
          // Skip completely empty lines at the start/end of a part to avoid unwanted spaces
          // Only render non-breaking space for truly blank lines in the middle of content
          const isFirstLine = lineIndex === 0;
          const isLastLine = lineIndex === lines.length - 1;
          const isEmpty = !line || line.trim() === '';

          // Skip rendering empty first/last lines from split artifacts
          if (isEmpty && (isFirstLine || isLastLine)) {
            return lineIndex < lines.length - 1 ? <br key={`${i}-${lineIndex}`} /> : null;
          }

          return (
            <React.Fragment key={`${i}-${lineIndex}`}>
              <span className={colorClass}>{preserveWhitespace(line) || '\u00A0'}</span>
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
};
