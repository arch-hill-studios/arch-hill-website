/**
 * Shared form field styles
 *
 * This file contains all shared styling classes for form fields across the application.
 * Any changes to colors, borders, spacing, etc. should be made here to maintain consistency.
 */

// Base shared styles that are reused across components
const sharedStyles = {
  // Common base styles for all input-like elements
  baseInput: 'w-full px-4 py-3 border transition-colors text-body-sm focus:outline-none',

  // State-based border and background styles
  normalState:
    'text-white placeholder:text-white/50 border-white/10 bg-brand-dark focus:ring-1 focus:ring-brand-primary focus:border-brand-primary',
  errorState:
    'border-red-500 text-black placeholder:text-black/50 bg-red-100 focus:ring-2 focus:ring-red-500 focus:border-red-500',
  disabledState: 'bg-gray-100 cursor-not-allowed opacity-60',

  // Interactive option container (radio/checkbox)
  optionContainer:
    'flex items-center gap-3 p-3 rounded-lg border border-brand-white/30 hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-all group',
  optionLabel: 'text-body-base group-hover:text-gray-900 flex-1',

  // Input controls
  radioCheckboxBase:
    'mt-1 w-4 h-4 text-brand-primary focus:ring-brand-primary focus:ring-2 cursor-pointer',
} as const;

export const formStyles = {
  // Label styles
  label: {
    base: 'block text-body-sm text-brand-white mb-2',
    required: 'text-brand-primary-hover',
    optional: 'text-gray-400 text-body-sm',
  },

  // Input field styles (text, email, tel, etc.)
  input: {
    base: sharedStyles.baseInput,
    normal: sharedStyles.normalState,
    error: sharedStyles.errorState,
    disabled: sharedStyles.disabledState,
  },

  // Textarea styles
  textarea: {
    base: `${sharedStyles.baseInput} resize-y`,
    normal: sharedStyles.normalState,
    error: sharedStyles.errorState,
    disabled: sharedStyles.disabledState,
    minHeight: 'min-h-[100px]',
  },

  // Radio and checkbox option container styles
  option: {
    container: sharedStyles.optionContainer,
    input: sharedStyles.radioCheckboxBase,
    inputCheckbox: `${sharedStyles.radioCheckboxBase} rounded`,
    label: sharedStyles.optionLabel,
  },

  // Yes/No field styles
  yesNo: {
    container: 'flex gap-4',
    option: `${sharedStyles.optionContainer} flex-1 items-center`,
    input: sharedStyles.radioCheckboxBase.replace('mt-1', ''), // Remove top margin for centered layout
    label: 'text-body-base group-hover:text-gray-900',
  },

  // Error message styles
  error: {
    text: 'mt-2 text-body-sm text-red-600',
  },

  // Helper text styles
  helper: {
    text: 'mb-3 text-body-sm',
  },

  // Field wrapper styles
  field: {
    wrapper: 'mb-6',
    subQuestionWrapper: 'mt-4 ml-2 pl-4 border-l-4 border-brand-primary/30 space-y-4',
  },

  // Group containers (for radio/checkbox groups)
  group: {
    container: 'space-y-3',
  },
} as const;

/**
 * Helper function to combine input styles based on state
 */
export const getInputClassNames = (hasError: boolean, disabled?: boolean): string => {
  const classes: string[] = [formStyles.input.base];

  if (disabled) {
    classes.push(formStyles.input.disabled);
  } else if (hasError) {
    classes.push(formStyles.input.error);
  } else {
    classes.push(formStyles.input.normal);
  }

  return classes.join(' ');
};

/**
 * Helper function to combine textarea styles based on state
 */
export const getTextareaClassNames = (hasError: boolean, disabled?: boolean): string => {
  const classes: string[] = [formStyles.textarea.base, formStyles.textarea.minHeight];

  if (disabled) {
    classes.push(formStyles.textarea.disabled);
  } else if (hasError) {
    classes.push(formStyles.textarea.error);
  } else {
    classes.push(formStyles.textarea.normal);
  }

  return classes.join(' ');
};
