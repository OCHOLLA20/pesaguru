import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../api/auth';

/**
 * Authentication context for PesaGuru application
 * Provides authentication state and methods for login, register, and logout
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check the authentication status of the current user
   */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Log in a user with email/username and password
   * @param {Object} credentials - User credentials {username, password}
   * @returns {Object} Logged in user data
   */
  const login = async (credentials) => {
    setError(null);
    try {
      const { access_token, user } = await loginUser(credentials);
      localStorage.setItem('token', access_token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} Registered user data
   */
  const register = async (userData) => {
    setError(null);
    try {
      const registeredUser = await registerUser(userData);
      
      // Automatically log in after registration
      await login({
        username: userData.email,
        password: userData.password
      });
      
      return registeredUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user profile data locally
   * @param {Object} updatedUserData - Updated user data
   */
  const updateUserData = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      updateUserData,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};