import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

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