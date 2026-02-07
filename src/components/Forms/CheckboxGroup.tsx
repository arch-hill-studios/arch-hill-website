import React from 'react';
import { UseFormSetValue, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { formStyles } from './formStyles';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  id: string;
  label: string;
  options: CheckboxOption[];
  required?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  helperText?: string;
  value: string[];
  setValue: UseFormSetValue<any>;
}

const CheckboxGroup = ({
  id,
  label,
  options,
  required = false,
  error,
  helperText,
  value,
  setValue,
}: CheckboxGroupProps) => {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (optionValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter((v) => v !== optionValue);
    setValue(id, newValues);
  };

  return (
    <div>
      <label htmlFor={id} className={formStyles.label.base}>
        {label} {required && <span className={formStyles.label.required}>*</span>}
      </label>
      {helperText && <p className={formStyles.helper.text}>{helperText}</p>}
      <div className={formStyles.group.container}>
        {options.map((option) => (
          <label key={option.value} className={formStyles.option.container}>
            <input
              type='checkbox'
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className={formStyles.option.inputCheckbox}
            />
            <span className={formStyles.option.label}>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className={formStyles.error.text}>{error.message as string}</p>}
    </div>
  );
};

export default CheckboxGroup;
