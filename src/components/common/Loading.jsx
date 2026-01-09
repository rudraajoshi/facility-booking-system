import PropTypes from 'prop-types';
/**
 * loading component with multiple display modes
 * @param {Object} props - component props
 * @param {'sm'|'md'|'lg'|'xl'} props.size - spinner size
 * @param {string} props.text - loading text
 * @param {boolean} props.fullscreen - display as fullscreen overlay
 * @param {boolean} props.inline - display inline with text
 */
const Loading = ({ 
  size = 'md',
  text = '',
  fullscreen = false,
  inline = false
}) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3',
    xl: 'h-24 w-24 border-4'
  };
  const spinner = (
    <div 
      className={`animate-spin rounded-full border-t-primary-600 border-r-transparent border-b-primary-600 border-l-transparent ${sizes[size]}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
  if (inline) {
    return (
      <span className="inline-flex items-center gap-2">
        <div 
          className={`animate-spin rounded-full border-t-primary-600 border-r-transparent border-b-primary-600 border-l-transparent ${sizes.sm}`}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        {text && <span className="text-sm text-neutral-600">{text}</span>}
      </span>
    );
  }
  if (fullscreen) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Loading"
      >
        {spinner}
        {text && <p className="mt-4 text-white font-medium">{text}</p>}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {spinner}
      {text && <p className="mt-4 text-neutral-600 font-medium">{text}</p>}
    </div>
  );
};
Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  text: PropTypes.string,
  fullscreen: PropTypes.bool,
  inline: PropTypes.bool
};

export default Loading;