import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { useAuth } from './AuthContext';

/**
 * LanguageContext provides language preference management for the PesaGuru application
 * Supports English (en) and Swahili (sw)
 */
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Initialize from localStorage, user preference, or default to English
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  // Update language when user changes or on initial load
  useEffect(() => {
    if (isAuthenticated && user?.preferred_language) {
      const userLanguage = user.preferred_language;
      if (userLanguage !== currentLanguage && (userLanguage === 'en' || userLanguage === 'sw')) {
        setCurrentLanguage(userLanguage);
      }
    }
  }, [isAuthenticated, user, currentLanguage]);

  // Apply language change to i18n and localStorage when currentLanguage changes
  useEffect(() => {
    if (currentLanguage) {
      // Change i18next language
      i18n.changeLanguage(currentLanguage);
      
      // Save to localStorage
      localStorage.setItem('preferredLanguage', currentLanguage);
    }
  }, [currentLanguage]);

  /**
   * Change the application language
   * @param {string} language - The language code to change to ('en' or 'sw')
   * @param {boolean} updateProfile - Whether to update the user profile (defaults to true)
   */
  const changeLanguage = async (language, updateProfile = true) => {
    if (language !== 'en' && language !== 'sw') {
      console.error('Unsupported language:', language);
      return;
    }

    setCurrentLanguage(language);

    // Update user preference in the backend if authenticated
    if (isAuthenticated && updateProfile) {
      try {
        const response = await fetch('/api/users/preferences/language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ language })
        });
        
        if (!response.ok) {
          console.warn('Failed to update language preference on server');
        }
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    }
  };

  /**
   * Get localized text for the given key
   * @param {string} key - The translation key
   * @param {Object} options - Additional options for translation
   * @returns {string} Translated text
   */
  const t = (key, options = {}) => {
    return i18n.t(key, options);
  };

  /**
   * Check if current language is the specified language
   * @param {string} language - The language code to check
   * @returns {boolean} True if current language matches
   */
  const isCurrentLanguage = (language) => {
    return currentLanguage === language;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t,
      isCurrentLanguage,
      supportedLanguages: ['en', 'sw']
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to use the language context
 * @returns {Object} Language context value
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};