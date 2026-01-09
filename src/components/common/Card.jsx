import PropTypes from 'prop-types';
/**
 * Card component for displaying content in a card layout
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover effect
 */
const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};
Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool
};
// card header
Card.Header = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);
Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
// card body
Card.Body = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);
Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
// card footer
Card.Footer = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);
Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
// card title
Card.Title = ({ children, className = '' }) => (
  <h4 className={`card-title ${className}`}>{children}</h4>
);
Card.Title.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Card;