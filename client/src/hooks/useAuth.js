import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../api/auth';

/**
 * Custom hook for handling authentication in the PesaGuru application
 * Provides authentication state and methods for login, logout, registration
 */
const useAuth = () => {
  // Use the shared authentication context
  const context = useContext(AuthContext);
  
  // If the hook is used outside of AuthProvider, throw an error
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Authentication provider component that manages auth state
 * This should wrap your application to provide auth context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
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

    checkAuthStatus();
  }, []);

  /**
   * Login the user
   * @param {Object} credentials - User credentials (email/username and password)
   * @returns {Promise} - Resolves to user data or rejects with error
   */
  const login = async (credentials) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { access_token, user } = await loginUser(credentials);
      localStorage.setItem('token', access_token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Resolves to user data or rejects with error
   */
  const register = async (userData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const registeredUser = await registerUser(userData);
      
      // Automatically log in after registration
      await login({
        username: userData.email,
        password: userData.password
      });
      
      return registeredUser;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  /**
   * Update user profile data
   * @param {Object} updatedData - New user data
   */
  const updateUserProfile = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
  };

  // Expose authentication state and methods
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;