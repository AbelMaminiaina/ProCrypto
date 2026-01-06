import { useState, InputHTMLAttributes } from 'react';
import { formatNumberInput } from '../../utils/validation';

interface NumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  helpText?: string;
  positiveOnly?: boolean;
  maxDecimals?: number;
}

/**
 * Numeric input component with validation
 */
function NumericInput({
  value,
  onChange,
  label,
  error,
  helpText,
  positiveOnly = true,
  maxDecimals = 8,
  className = '',
  ...props
}: NumericInputProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formatted = formatNumberInput(e.target.value);

    // Remove negative sign if positiveOnly
    if (positiveOnly) {
      formatted = formatted.replace('-', '');
    }

    // Limit decimal places
    const parts = formatted.split('.');
    if (parts.length > 1 && parts[1].length > maxDecimals) {
      formatted = `${parts[0]}.${parts[1].slice(0, maxDecimals)}`;
    }

    onChange(formatted);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const showError = touched && error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          showError
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-primary focus:border-primary'
        } ${className}`}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${props.id}-error` : helpText ? `${props.id}-help` : undefined}
        {...props}
      />

      {showError && (
        <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!showError && helpText && (
        <p id={`${props.id}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default NumericInput;
