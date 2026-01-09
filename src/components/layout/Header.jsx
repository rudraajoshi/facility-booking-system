
import { Link, NavLink } from 'react-router-dom';

function Header() {
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

          {/* login/signup buttons */}
          <div className="flex gap-3">
            <button className="btn-ghost">Login</button>
            <button className="btn-primary">Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;