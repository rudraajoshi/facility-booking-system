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

// check auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // try to get user from localStorage first for instant load
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch (err) {
            console.error('Failed to parse cached user:', err);
          }
        }

        // then fetch fresh profile from server
        const profile = await getProfile();
        setUser(profile);
        
        // update cache
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (err) {
        console.error('Auth init failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // signup
  const signup = async (data) => {
    try {
      setError(null);
      setLoading(true);

      const userData = await registerUser(data);
      setUser(userData);
      
      // cache user data
      localStorage.setItem('user', JSON.stringify(userData));

      return true;
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

//  login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const userData = await loginUser({ email, password });
      setUser(userData);
      
      // cache user data
      localStorage.setItem('user', JSON.stringify(userData));

      return true;
    } catch (err) {
      setError('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

// logout
  const logout = () => {
    logoutUser();
    localStorage.removeItem('user');
    setUser(null);
  };

// update
  const updateProfile = async (updates) => {
    try {
      const updatedUser = await updateProfileService(updates);
      setUser(updatedUser);
      
      // update cache
      localStorage.setItem('user', JSON.stringify(updatedUser));
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