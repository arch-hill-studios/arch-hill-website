import React from 'react';
import { UseFormRegister, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { formStyles, getTextareaClassNames } from './formStyles';

interface TextAreaProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  helperText?: string;
  register: UseFormRegister<any>;
  validation?: object;
  rows?: number;
  showOptionalLabel?: boolean;
}

const TextArea = ({
  id,
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  register,
  validation = {},
  rows = 4,
  showOptionalLabel = false,
}: TextAreaProps) => {
  return (
    <div>
      <label htmlFor={id} className={formStyles.label.base}>
        {label}
      </label>
      {helperText && <p className={formStyles.helper.text}>{helperText}</p>}
      <textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...register(id, validation)}
        className={getTextareaClassNames(!!error, disabled)}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <p className={formStyles.error.text}>{error.message as string}</p>}
    </div>
  );
};

export default TextArea;
