import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-slate-400 bg-white/50
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
          transition-all duration-200 hover:shadow-md
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center"><span className="mr-1">⚠️</span>{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500 flex items-center"><span className="mr-1">💡</span>{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';