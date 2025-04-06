import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * ThemeContext provides theme management for the PesaGuru application
 * Supports light and dark themes with system preference detection
 */
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Initialize theme state from localStorage, user preference, or system preference
  const [theme, setTheme] = useState(() => {
    // First try to get from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // If no saved theme, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light theme
    return 'light';
  });

  // Check for user preference when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.theme_preference) {
      const userTheme = user.theme_preference;
      if (userTheme !== theme && (userTheme === 'light' || userTheme === 'dark')) {
        setTheme(userTheme);
      }
    }
  }, [isAuthenticated, user, theme]);

  // Apply theme to document when theme changes
  useEffect(() => {
    // Remove any existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add the current theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Update data-theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply specific dark mode class for Tailwind Dark Mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      updateUserThemePreference(newTheme);
      return newTheme;
    });
  };

  /**
   * Set a specific theme
   * @param {string} newTheme - The theme to set ('light' or 'dark')
   */
  const setAppTheme = (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.error('Invalid theme:', newTheme);
      return;
    }
    
    setTheme(newTheme);
    updateUserThemePreference(newTheme);
  };

  /**
   * Update user theme preference in the backend
   * @param {string} themePreference - The theme preference to save
   */
  const updateUserThemePreference = async (themePreference) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch('/api/users/preferences/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ theme: themePreference })
      });
      
      if (!response.ok) {
        console.warn('Failed to update theme preference on server');
      }
    } catch (error) {
      console.error('Error updating theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      isDarkMode: theme === 'dark',
      isLightMode: theme === 'light',
      toggleTheme,
      setTheme: setAppTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};