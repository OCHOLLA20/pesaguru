import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSelector - A component that allows users to switch between English and Swahili
 * Stores language preference in localStorage and updates i18n context
 */
const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  // Set initial language from localStorage or browser preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  /**
   * Handles language change and persists selection
   * @param {string} lng - Language code ('en' or 'sw')
   */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    
    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', lng);
    
    // Call server to update user preference if logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/users/preferences/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ language: lng })
      }).catch(err => console.error('Failed to update language preference:', err));
    }
  };

  const currentLanguage = i18n.language || 'en';

  return (
    <div className="flex items-center space-x-2 rounded-md bg-white/5 p-1">
      <button
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentLanguage === 'en' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => changeLanguage('en')}
        aria-pressed={currentLanguage === 'en'}
      >
        English
      </button>
      <button
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          currentLanguage === 'sw' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => changeLanguage('sw')}
        aria-pressed={currentLanguage === 'sw'}
      >
        Kiswahili
      </button>
    </div>
  );
};

export default LanguageSelector;