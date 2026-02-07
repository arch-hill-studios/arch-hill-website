import React from 'react';
import { UseFormRegister, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { formStyles } from './formStyles';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  id: string;
  label: string;
  options: RadioOption[];
  required?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  helperText?: string;
  register: UseFormRegister<any>;
  validation?: object;
}

const RadioGroup = ({
  id,
  label,
  options,
  required = false,
  error,
  helperText,
  register,
  validation = {},
}: RadioGroupProps) => {
  return (
    <div>
      <label htmlFor={id} className={formStyles.label.base}>
        {label} {required && <span className={formStyles.label.required}>*</span>}
      </label>
      <div className={formStyles.group.container}>
        {options.map((option) => (
          <label key={option.value} className={formStyles.option.container}>
            <input
              type='radio'
              value={option.value}
              {...register(id, validation)}
              className={formStyles.option.input}
            />
            <span className={formStyles.option.label}>{option.label}</span>
          </label>
        ))}
      </div>
      {helperText && <p className={formStyles.helper.text}>{helperText}</p>}
      {error && <p className={formStyles.error.text}>{error.message as string}</p>}
    </div>
  );
};

export default RadioGroup;
