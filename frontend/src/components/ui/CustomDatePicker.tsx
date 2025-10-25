import React from 'react';
import { Calendar } from 'lucide-react';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  name?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  error,
  name
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="date"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 pl-11 bg-white dark:bg-dark-800 border-2 rounded-lg transition-all duration-200 text-gray-900 dark:text-white appearance-none cursor-pointer ${
            error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/30'
          } [color-scheme:light] dark:[color-scheme:dark]`}
          style={{
            colorScheme: 'auto'
          }}
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 pointer-events-none" />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CustomDatePicker;
