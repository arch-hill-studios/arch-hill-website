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
    <fieldset className='border-0 m-0 p-0' aria-describedby={error ? `${id}-error` : undefined}>
      <legend className={formStyles.label.base}>
        {label} {required && <span className={formStyles.label.required}>*</span>}
      </legend>
      {helperText && <p className={formStyles.helper.text}>{helperText}</p>}
      <div className={formStyles.yesNo.container}>
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
    </fieldset>
  );
};

export default YesNoField;
