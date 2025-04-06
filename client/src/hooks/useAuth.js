import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for handling authentication in the PesaGuru application
 * Provides authentication state and methods for login, logout, registration
 * 
 * @returns {Object} Authentication context with user state and auth methods
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

export default useAuth;
