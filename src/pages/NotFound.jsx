import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50">
      <div className="text-center px-4">
        {/* error 404 */}
        <div className="relative inline-block mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4 animate-bounce-slow">
            404
          </div>
          <div className="absolute inset-0 text-9xl font-bold text-primary-200 blur-lg opacity-50 animate-pulse">
            404
          </div>
        </div>

        {/* icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* title */}
        <h1 className="text-4xl font-display font-bold text-neutral-800 mb-3">
          Page Not Found
        </h1>

        {/* desc*/}
        <p className="text-neutral-600 mb-8 max-w-md mx-auto text-lg">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return to Home
              </span>
            </Button>
          </Link>

          <Link to="/facilities">
            <Button variant="outline" size="lg">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Browse Facilities
              </span>
            </Button>
          </Link>
        </div>

        {/* help */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            Need help? <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;