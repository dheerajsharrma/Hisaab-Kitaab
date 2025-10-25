import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: 'fixed',
          top: `${rect.bottom + 8}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          zIndex: 9999
        });
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    updatePosition();

    if (isOpen) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('keydown', handleEscape);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-dark-800 border-2 rounded-lg transition-all duration-200 text-left ${
          error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/30'
        }`}
      >
        <span className={`flex items-center gap-2 ${!selectedOption ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      <AnimatePresence>
        {isOpen && createPortal(
          <>
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={dropdownStyle}
              className="bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-all duration-150 ${
                    value === option.value
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
