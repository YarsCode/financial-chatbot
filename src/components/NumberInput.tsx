import { useEffect, useRef } from 'react';

interface NumberInputProps {
  type: 'number' | 'sum';
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
}

export function NumberInput({ type, value, onChange, onSubmit, placeholder, className, onBlur }: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow numbers, decimals, and handle negative values
    if (inputValue === '' || /^-?\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className="relative">
      {type === 'sum' && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-xl">
          ₪
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onBlur={onBlur}
        placeholder={placeholder || (type === 'sum' ? 'הכנס סכום' : 'הכנס מספר')}
        className={`w-full px-4 py-3 border border-[#aeaeae] bg-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)] ${
          type === 'sum' ? 'pl-8' : ''
        } ${className || ''}`}
      />
    </div>
  );
}
