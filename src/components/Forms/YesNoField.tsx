import React from 'react';
import { UseFormRegister, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { formStyles } from './formStyles';

interface YesNoFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  helperText?: string;
  register: UseFormRegister<any>;
  validation?: object;
}

const YesNoField = ({
  id,
  label,
  required = false,
  error,
  helperText,
  register,
  validation = {},
}: YesNoFieldProps) => {
  return (
    <div>
      <label id={`${id}-label`} htmlFor={id} className={formStyles.label.base}>
        {label} {required && <span className={formStyles.label.required}>*</span>}
      </label>
      {helperText && <p className={formStyles.helper.text}>{helperText}</p>}
      <div
        role='group'
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        className={formStyles.yesNo.container}
      >
        <label className={formStyles.yesNo.option}>
          <input
            type='radio'
            value='yes'
            {...register(id, validation)}
            className={formStyles.yesNo.input}
          />
          <span className={formStyles.yesNo.label}>Yes</span>
        </label>
        <label className={formStyles.yesNo.option}>
          <input
            type='radio'
            value='no'
            {...register(id, validation)}
            className={formStyles.yesNo.input}
          />
          <span className={formStyles.yesNo.label}>No</span>
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className={formStyles.error.text}>
          {error.message as string}
        </p>
      )}
    </div>
  );
};

export default YesNoField;
