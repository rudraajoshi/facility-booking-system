import PropTypes from 'prop-types';
/**
 * button component with multiple variants, sizes, and states
 * @param {Object} props - component props
 * @param {'primary'|'secondary'|'outline'|'danger'|'ghost'|'white'} props.variant - button style variant
 * @param {'sm'|'md'|'lg'} props.size - button size
 * @param {React.ReactNode} props.children - button content
 * @param {Function} props.onClick - click handler
 * @param {'button'|'submit'|'reset'} props.type - button type
 * @param {boolean} props.disabled - whether button is disabled
 * @param {boolean} props.loading - whether button is in loading state
 * @param {string} props.className - additional CSS classes
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'bg-accent-600 text-white hover:bg-accent-700 shadow-md hover:shadow-lg',
    outline: 'btn-outline',
    danger: 'bg-error-600 text-white hover:bg-error-700 shadow-md hover:shadow-lg',
    ghost: 'btn-ghost',
    white: 'bg-white text-primary-700 hover:bg-primary-50 shadow-md hover:shadow-lg'
  };
  const sizes = {
    sm: 'btn-sm',
    md: 'btn px-6 py-2.5',
    lg: 'btn-lg'
  };
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  const classes = `${variants[variant] || variants.primary} ${sizes[size]} ${disabledClass} ${className}`;
  return (
    <button 
      type={type} 
      className={classes} 
      onClick={onClick} 
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{children}</span>
        </span>
      ) : children}
    </button>
  );
};
Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'ghost', 'white']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default Button;