import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  loginUser,
  registerUser,
  getProfile,
  logoutUser,
  updateProfile as updateProfileService,
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  /**
   * Check auth on app load
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        console.error('Auth init failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Signup
   */
  const signup = async (data) => {
    try {
      setError(null);
      setLoading(true);

      const userData = await registerUser(data);
      setUser(userData);

      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const userData = await loginUser({ email, password });
      setUser(userData);

      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  /**
   * Update profile
   */
  const updateProfile = async (updates) => {
    try {
      const updatedUser = await updateProfileService(updates);
      setUser(updatedUser);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    signup,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
