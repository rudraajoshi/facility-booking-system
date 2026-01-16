import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Computed boolean - automatically updates when user changes
  const isAuthenticated = user !== null;

  // Debug: Log whenever user or isAuthenticated changes
  useEffect(() => {
    console.log('🔄 Auth State Changed:');
    console.log('  user:', user);
    console.log('  isAuthenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedEmail = localStorage.getItem('currentUserEmail');
        console.log('🔍 Checking auth on mount, storedEmail:', storedEmail);
        
        if (storedEmail) {
          // Try to get current user from API
          const response = await fetch('/api/auth/me');
          
          // Check if response is JSON
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn('⚠️ MSW is not running - API returned HTML instead of JSON');
            setLoading(false);
            return;
          }
          
          const result = await response.json();
          console.log('📥 /api/auth/me response:', result);

          if (result.success) {
            console.log('✅ Auth check successful, setting user:', result.data);
            setUser(result.data);
          } else {
            console.log('❌ Auth check failed, clearing localStorage');
            // If API says not authenticated, clear localStorage
            localStorage.removeItem('currentUserEmail');
            localStorage.removeItem('currentUser');
          }
        } else {
          console.log('ℹ️ No stored email found');
        }
      } catch (err) {
        console.error('❌ Error checking auth:', err);
      } finally {
        setLoading(false);
        console.log('✅ Auth check complete, loading set to false');
      }
    };

    checkAuth();
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<boolean>}
   */
  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('MSW is not running. Please restart your dev server.');
        console.error('MSW is not intercepting requests. Make sure you ran: npx msw init public/');
        return false;
      }

      const result = await response.json();

      if (result.success) {
        console.log('✅ Signup successful, setting user:', result.data);
        setUser(result.data);
        localStorage.setItem('currentUserEmail', result.data.email);
        localStorage.setItem('currentUser', JSON.stringify(result.data));
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Signup error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔐 Attempting login for:', email);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('MSW is not running. Please restart your dev server.');
        console.error('MSW is not intercepting requests. Make sure you ran: npx msw init public/');
        return false;
      }

      const result = await response.json();
      console.log('📥 Login response:', result);

      if (result.success) {
        console.log('✅ Login successful! Setting user:', result.data);
        setUser(result.data);
        localStorage.setItem('currentUserEmail', result.data.email);
        localStorage.setItem('currentUser', JSON.stringify(result.data));
        console.log('✅ User state and localStorage updated');
        console.log('✅ isAuthenticated should now be:', result.data !== null);
        return true;
      } else {
        console.log('❌ Login failed:', result.error);
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('❌ Login error:', err);
      return false;
    } finally {
      setLoading(false);
      console.log('✅ Login process complete, loading set to false');
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      setUser(null);
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('currentUser');
      console.log('✅ Logout complete');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('currentUser');
    }
  };

  /**
   * Get current user
   * @returns {Object|null}
   */
  const getCurrentUser = () => {
    return user;
  };

  /**
   * Update user profile
   * @param {Object} updates
   */
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    updateProfile,
  };

  console.log('🎯 AuthContext providing value:', { user: user?.name, isAuthenticated, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};