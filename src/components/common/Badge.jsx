import PropTypes from 'prop-types';
/**
 * @param {Object} props - component props
 * @param {'success'|'warning'|'error'|'info'|'gray'|'default'} props.variant - badge style variant
 * @param {'sm'|'md'|'lg'} props.size - badge size
 * @param {React.ReactNode} props.children - badge content
 */
const Badge = ({ 
  variant = 'default', 
  size = 'md',
  children 
}) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'bg-primary-100 text-primary-800 ring-1 ring-primary-200',
    gray: 'bg-neutral-200 text-neutral-700 ring-1 ring-neutral-300',
    default: 'bg-neutral-200 text-neutral-700'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'gray', 'default']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired
};

export default Badge;