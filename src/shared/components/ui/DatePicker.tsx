import React from 'react';
import { Input } from './Input';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, min, max, error }) => (
  <Input
    type="date"
    label={label}
    value={value}
    onChange={e => onChange(e.target.value)}
    min={min}
    max={max}
    error={error}
  />
);
