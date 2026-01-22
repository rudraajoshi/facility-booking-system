import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // automatically updates when user changes
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  // log whenever user or isAuthenticated changes
  useEffect(() => {
    console.log('🔄 Auth State Changed:');
    console.log('  user:', user);
    console.log('  isAuthenticated:', isAuthenticated);
    console.log('  isAdmin:', isAdmin);
  }, [user, isAuthenticated, isAdmin]);

  // check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedEmail = localStorage.getItem('currentUserEmail');
        const storedRole = localStorage.getItem('currentUserRole');
        console.log('🔍 Checking auth on mount, storedEmail:', storedEmail, 'storedRole:', storedRole);
        
        if (storedEmail) {
          // try to get current user from API
          const response = await fetch('/api/auth/me');
          
          // check if response is JSON
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
            // if API says not authenticated, clear localStorage
            localStorage.removeItem('currentUserEmail');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserRole');
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
   * register a new user
   * @param {Object} userData 
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

      // check if response is JSON
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
        localStorage.setItem('currentUserRole', result.data.role || 'user');
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
   * login user (regular or admin)
   * @param {string} email
   * @param {string} password
   * @param {string} role 
   * @returns {Promise<boolean>}
   */
  const login = async (email, password, role = 'user') => {
    try {
      setError(null);
      setLoading(true);

      console.log('🔐 Attempting login for:', email, 'as', role);

      const endpoint = role === 'admin' ? '/api/auth/admin/login' : '/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // check if response is JSON
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
        localStorage.setItem('currentUserRole', result.data.role || 'user');
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
   * logout user
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
      localStorage.removeItem('currentUserRole');
      console.log('✅ Logout complete');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem('currentUserEmail');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserRole');
    }
  };

  /**
   * get current user
   * @returns {Object|null}
   */
  const getCurrentUser = () => {
    return user;
  };

  /**
   * update user profile
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
    isAdmin,
    getCurrentUser,
    updateProfile,
  };

  console.log('🎯 AuthContext providing value:', { 
    user: user?.name, 
    isAuthenticated, 
    isAdmin,
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};