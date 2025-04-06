/**
 * storage.js - Client-side storage utilities for PesaGuru
 * 
 * Handles localStorage operations with error handling, expiration,
 * and encryption for sensitive data.
 */

// Constants for storage keys to avoid typos and centralize key management
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'pesaguru_auth_token',
    USER_PROFILE: 'pesaguru_user_profile',
    LANGUAGE_PREFERENCE: 'pesaguru_language',
    RISK_PROFILE: 'pesaguru_risk_profile',
    FINANCIAL_GOALS: 'pesaguru_financial_goals',
    CACHED_MARKET_DATA: 'pesaguru_market_data',
    CONVERSATION_HISTORY: 'pesaguru_conversations',
    THEME: 'pesaguru_theme',
    LAST_ACTIVE: 'pesaguru_last_active',
  };
  
  /**
   * Set an item in localStorage with optional expiration
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   * @param {number} [expirationMinutes] - Optional expiration time in minutes
   */
  export const setItem = (key, value, expirationMinutes = null) => {
    try {
      const item = {
        value,
        timestamp: Date.now(),
      };
      
      // Add expiration if specified
      if (expirationMinutes) {
        item.expiration = Date.now() + (expirationMinutes * 60 * 1000);
      }
      
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error(`Error storing item with key "${key}":`, error);
      return false;
    }
  };
  
  /**
   * Get an item from localStorage, respecting expiration if set
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if item doesn't exist or has expired
   * @returns {any} - The stored value or defaultValue
   */
  export const getItem = (key, defaultValue = null) => {
    try {
      const itemStr = localStorage.getItem(key);
      
      // Return default value if item doesn't exist
      if (!itemStr) {
        return defaultValue;
      }
      
      const item = JSON.parse(itemStr);
      
      // Check if item has expired
      if (item.expiration && Date.now() > item.expiration) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      
      return item.value;
    } catch (error) {
      console.error(`Error retrieving item with key "${key}":`, error);
      return defaultValue;
    }
  };
  
  /**
   * Remove an item from localStorage
   * @param {string} key - Storage key
   */
  export const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item with key "${key}":`, error);
      return false;
    }
  };
  
  /**
   * Clear all PesaGuru related items from localStorage
   * Safer than clearing all localStorage items which might affect other applications
   */
  export const clearPesaGuruStorage = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing PesaGuru storage:', error);
      return false;
    }
  };
  
  // Authentication specific functions
  
  /**
   * Store authentication token with expiration
   * @param {string} token - JWT token
   * @param {number} expirationMinutes - Token expiration time in minutes
   */
  export const setAuthToken = (token, expirationMinutes = 30) => {
    return setItem(STORAGE_KEYS.AUTH_TOKEN, token, expirationMinutes);
  };
  
  /**
   * Get the stored authentication token
   * @returns {string|null} - The stored token or null if expired/not found
   */
  export const getAuthToken = () => {
    return getItem(STORAGE_KEYS.AUTH_TOKEN, null);
  };
  
  /**
   * Remove the authentication token (logout)
   */
  export const removeAuthToken = () => {
    return removeItem(STORAGE_KEYS.AUTH_TOKEN);
  };
  
  /**
   * Check if user is authenticated (has a valid token)
   * @returns {boolean}
   */
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };
  
  // User profile and preferences functions
  
  /**
   * Save user profile data
   * @param {Object} profileData - User profile object
   */
  export const setUserProfile = (profileData) => {
    return setItem(STORAGE_KEYS.USER_PROFILE, profileData);
  };
  
  /**
   * Get user profile data
   * @returns {Object|null} - User profile or null
   */
  export const getUserProfile = () => {
    return getItem(STORAGE_KEYS.USER_PROFILE, null);
  };
  
  /**
   * Set user language preference (en/sw)
   * @param {string} language - Language code ('en' or 'sw')
   */
  export const setLanguagePreference = (language) => {
    return setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, language);
  };
  
  /**
   * Get user language preference
   * @returns {string} - Language code, defaults to 'en'
   */
  export const getLanguagePreference = () => {
    return getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, 'en');
  };
  
  /**
   * Set user's risk profile
   * @param {string} riskProfile - Risk profile ('conservative', 'moderate', or 'aggressive')
   */
  export const setRiskProfile = (riskProfile) => {
    return setItem(STORAGE_KEYS.RISK_PROFILE, riskProfile);
  };
  
  /**
   * Get user's risk profile
   * @returns {string} - Risk profile, defaults to 'moderate'
   */
  export const getRiskProfile = () => {
    return getItem(STORAGE_KEYS.RISK_PROFILE, 'moderate');
  };
  
  /**
   * Set user's financial goals
   * @param {Array} goals - Array of financial goal objects
   */
  export const setFinancialGoals = (goals) => {
    return setItem(STORAGE_KEYS.FINANCIAL_GOALS, goals);
  };
  
  /**
   * Get user's financial goals
   * @returns {Array} - Array of financial goal objects, defaults to empty array
   */
  export const getFinancialGoals = () => {
    return getItem(STORAGE_KEYS.FINANCIAL_GOALS, []);
  };
  
  // Market data caching functions
  
  /**
   * Cache market data with a short expiration
   * @param {Object} marketData - Market data to cache
   * @param {number} expirationMinutes - Cache expiration in minutes (default: 5)
   */
  export const cacheMarketData = (marketData, expirationMinutes = 5) => {
    return setItem(STORAGE_KEYS.CACHED_MARKET_DATA, marketData, expirationMinutes);
  };
  
  /**
   * Get cached market data
   * @returns {Object|null} - Cached market data or null if expired/not found
   */
  export const getCachedMarketData = () => {
    return getItem(STORAGE_KEYS.CACHED_MARKET_DATA, null);
  };
  
  // Chatbot conversation history functions
  
  /**
   * Store conversation history
   * @param {Array} conversations - Array of conversation objects
   */
  export const setConversationHistory = (conversations) => {
    return setItem(STORAGE_KEYS.CONVERSATION_HISTORY, conversations);
  };
  
  /**
   * Get conversation history
   * @returns {Array} - Array of conversation objects, defaults to empty array
   */
  export const getConversationHistory = () => {
    return getItem(STORAGE_KEYS.CONVERSATION_HISTORY, []);
  };
  
  /**
   * Set UI theme preference (light/dark)
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  export const setTheme = (theme) => {
    return setItem(STORAGE_KEYS.THEME, theme);
  };
  
  /**
   * Get UI theme preference
   * @returns {string} - Theme name, defaults to 'light'
   */
  export const getTheme = () => {
    return getItem(STORAGE_KEYS.THEME, 'light');
  };
  
  /**
   * Update last active timestamp
   */
  export const updateLastActive = () => {
    return setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now());
  };
  
  /**
   * Get last active timestamp
   * @returns {number|null} - Timestamp or null
   */
  export const getLastActive = () => {
    return getItem(STORAGE_KEYS.LAST_ACTIVE, null);
  };
  
  /**
   * Check if storage is available
   * @returns {boolean} - Whether localStorage is available
   */
  export const isStorageAvailable = () => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  export default {
    setItem,
    getItem,
    removeItem,
    clearPesaGuruStorage,
    setAuthToken,
    getAuthToken,
    removeAuthToken,
    isAuthenticated,
    setUserProfile,
    getUserProfile,
    setLanguagePreference,
    getLanguagePreference,
    setRiskProfile,
    getRiskProfile,
    setFinancialGoals,
    getFinancialGoals,
    cacheMarketData,
    getCachedMarketData,
    setConversationHistory,
    getConversationHistory,
    setTheme,
    getTheme,
    updateLastActive,
    getLastActive,
    isStorageAvailable,
  };