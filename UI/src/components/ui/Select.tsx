import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`
          block w-full px-4 py-3 border rounded-xl shadow-sm bg-white/50 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
          transition-all duration-200 hover:shadow-md hover:border-slate-300
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : 'border-slate-200'}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 flex items-center"><span className="mr-1">⚠️</span>{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500 flex items-center"><span className="mr-1">💡</span>{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';