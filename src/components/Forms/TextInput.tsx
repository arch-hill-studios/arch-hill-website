import React from 'react';
import { UseFormRegister, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { formStyles, getInputClassNames } from './formStyles';

interface TextInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  helperText?: string;
  register: UseFormRegister<any>;
  validation?: object;
  showOptionalLabel?: boolean;
}

const TextInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  register,
  validation = {},
  showOptionalLabel = false,
}: TextInputProps) => {
  return (
    <div>
      <label htmlFor={id} className={formStyles.label.base}>
        {label}
      </label>
      {helperText && <p className={formStyles.helper.text}>{helperText}</p>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(id, validation)}
        className={getInputClassNames(!!error, disabled)}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <p className={formStyles.error.text}>{error.message as string}</p>}
    </div>
  );
};

export default TextInput;
