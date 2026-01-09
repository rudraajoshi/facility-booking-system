import PropTypes from 'prop-types';
/**
 * input component with support for text, textarea, and select inputs
 * @param {Object} props - component props
 * @param {string} props.label - input label
 * @param {'text'|'email'|'password'|'number'|'date'|'time'|'tel'|'textarea'|'select'} props.type - input type
 * @param {string} props.name - input name
 * @param {string|number} props.value - input value
 * @param {Function} props.onChange - change handler
 * @param {string} props.error - error message
 * @param {string} props.placeholder - input placeholder
 * @param {boolean} props.required - whether input is required
 * @param {boolean} props.disabled - whether input is disabled
 * @param {string} props.className - additional CSS classes
 * @param {React.ReactNode} props.children - children [select options]
 */
const Input = ({ 
  label, 
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '', 
  children,
  ...props 
}) => {
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClass = type === 'textarea' ? 'textarea' : type === 'select' ? 'select' : 'input';
  const errorClass = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : '';
  const disabledClass = disabled ? 'bg-neutral-100 cursor-not-allowed' : '';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="text-error-500 ml-1" aria-label="required">*</span>}
        </label>
      )}   
      {type === 'textarea' ? (
        <textarea 
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${inputClass} ${errorClass} ${disabledClass} ${className}`} 
          {...props} 
        />
      ) : type === 'select' ? (
        <select 
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${inputClass} ${errorClass} ${disabledClass} ${className}`} 
          {...props}
        >
          {children}
        </select>
      ) : (
        <input 
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${inputClass} ${errorClass} ${disabledClass} ${className}`} 
          {...props} 
        />
      )}
      {error && (
        <div id={`${inputId}-error`} className="flex items-center gap-1 mt-1" role="alert">
          <svg className="w-4 h-4 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-error-600 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'time', 'tel', 'url', 'search', 'textarea', 'select']),
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};
export default Input;