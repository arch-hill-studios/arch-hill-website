import React from 'react';
import { StringInputProps, set, unset } from 'sanity';
import { ICON_LIBRARY, IconKey } from '@/lib/iconLibrary';
import Icon from '@/lib/iconLibrary';

const IconSelector = (props: StringInputProps) => {
  const { onChange, value } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onChange(selectedValue ? set(selectedValue) : unset());
  };

  return (
    <div>
      <select
        value={value || ''}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
        }}>
        <option value=''>Select an icon...</option>
        {Object.entries(ICON_LIBRARY).map(([key, { name }]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      {/* Icon Preview */}
      {value && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#f9f9f9',
          }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon iconKey={value as IconKey} width={2} colorClassName='text-black' />
          </div>
          <div>
            <strong className='text-black'>{ICON_LIBRARY[value as IconKey].name}</strong>
            <div style={{ fontSize: '12px', color: '#666' }}>Key: {value}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSelector;
