import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import Button from '../common/Button';
import Footer from './Footer';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* left */}
            <div className="flex items-center gap-4">
              {/* mobile menu toggle */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* logo */}
              <Link 
                to="/" 
                className="text-2xl font-display font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Facility Booking System
              </Link>
            </div>

            {/* right */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  {/* user information */}
                  <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-neutral-100 rounded-lg">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-neutral-900">{currentUser.name}</p>
                      <p className="text-xs text-neutral-600">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* logout */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="hover:bg-error-50 hover:text-error-600 hover:border-error-300"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* sidebar navigation */}
        <aside
          className={`
            fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] 
            bg-white border-r border-neutral-200 
            transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${isSidebarOpen ? 'w-64' : 'lg:w-20'}
          `}
        >
          {/* sidebar toggle */}
          <div className="hidden lg:flex justify-end p-4 border-b border-neutral-200">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg 
                className={`w-5 h-5 text-neutral-700 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* links */}
          <nav className="p-4 space-y-2">
            {/* home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg 
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-600'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {isSidebarOpen && <span>Home</span>}
                  {isActive && isSidebarOpen && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>

            {/* facilities */}
            <NavLink
              to="/facilities"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg 
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-600'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {isSidebarOpen && <span>Facilities</span>}
                  {isActive && isSidebarOpen && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>

            {/* my bookings */}
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg 
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-600'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {isSidebarOpen && <span>My Bookings</span>}
                  {isActive && isSidebarOpen && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* sidebar footer */}
          {isSidebarOpen && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-neutral-50">
              <div className="text-xs text-neutral-500 text-center">
                <p>©Facility Booking System</p>
                <p className="mt-1">v1.0.0</p>
              </div>
            </div>
          )}
        </aside>

        {/* mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* main content area with footer */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
          
          {/* footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Layout;