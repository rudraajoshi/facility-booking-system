import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  console.log('🎨 Header Render - isAuthenticated:', isAuthenticated, 'user:', user);

  return (
    <nav className="bg-white shadow-md border-b border-neutral-200 sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* logo */}
          <Link 
            to="/" 
            className="text-2xl font-display font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Facility Booking System
          </Link>

          {/* navigation links */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-primary-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/facilities"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-primary-600'
                }`
              }
            >
              Facilities
            </NavLink>
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-primary-600'
                }`
              }
            >
              My Bookings
            </NavLink>

            {!isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-neutral-500 hover:text-primary-600'
                  }`
                }
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin
              </NavLink>
            )}
          </div>

          {/* login/signup buttons or user info */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* user Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    Hi, {user?.name?.split(' ')[0]}
                    {isAdmin && <span className="ml-1 text-xs text-primary-600">(Admin)</span>}
                  </span>
                </div>
                {/* logout button */}
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* login button */}
                <Link to="/login">
                  <Button variant="ghost">
                    Login
                  </Button>
                </Link>
                {/* sign up button */}
                <Link to="/signup">
                  <Button variant="primary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;