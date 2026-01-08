import { Link } from 'react-router-dom';
function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for does not exist.
        </p>
        <Link to="/" className="btn-primary btn-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;