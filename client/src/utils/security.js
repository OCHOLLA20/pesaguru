/**
 * Security utility functions for PesaGuru client application
 * Provides functions for input validation, data protection, 
 * and secure authentication handling
 */

import CryptoJS from 'crypto-js'; // Ensure this is added to package.json

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Replace potentially dangerous HTML tags and scripts
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with status and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { 
      isValid: false, 
      message: 'Password is required' 
    };
  }

  // At least 8 characters with at least 1 letter, 1 number, and 1 special character
  const minLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Evaluate password strength
  let strength = 0;
  let message = '';
  
  if (minLength) strength += 1;
  if (hasLetter) strength += 1;
  if (hasNumber) strength += 1;
  if (hasSpecial) strength += 1;
  
  const isValid = minLength && hasLetter && hasNumber && hasSpecial;
  
  switch (strength) {
    case 0:
    case 1:
      message = 'Password is very weak';
      break;
    case 2:
      message = 'Password is weak';
      break;
    case 3:
      message = 'Password is moderately strong';
      break;
    case 4:
      message = 'Password is strong';
      break;
    default:
      message = 'Password strength unknown';
  }
  
  return {
    isValid,
    message,
    strength,
    checks: {
      minLength,
      hasLetter,
      hasNumber,
      hasSpecial
    }
  };
};

/**
 * Validates Kenyan phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  
  // Remove any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check for valid Kenyan formats:
  // 1. 07xxxxxxxx or 01xxxxxxxx (10 digits with leading 0)
  // 2. 7xxxxxxxx or 1xxxxxxxx (9 digits without leading 0)
  // 3. 2547xxxxxxxx or 2541xxxxxxxx (12 digits with country code)
  const isValidFormat = 
    (cleaned.length === 10 && cleaned.startsWith('0') && 
     (cleaned[1] === '7' || cleaned[1] === '1')) ||
    (cleaned.length === 9 && 
     (cleaned[0] === '7' || cleaned[0] === '1')) ||
    (cleaned.length === 12 && cleaned.startsWith('254') && 
     (cleaned[3] === '7' || cleaned[3] === '1'));
  
  return isValidFormat;
};

/**
 * Validates Kenyan email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  // Basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Encrypt sensitive data using AES
 * @param {string} data - Data to encrypt
 * @param {string} secretKey - Secret key for encryption (defaults to env variable)
 * @returns {string} Encrypted data
 */
export const encryptData = (data, secretKey = process.env.REACT_APP_ENCRYPTION_KEY) => {
  if (!data) return '';
  if (!secretKey) {
    console.error('No encryption key provided');
    return '';
  }
  
  try {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data), 
      secretKey
    ).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Decrypt sensitive data using AES
 * @param {string} encryptedData - Data to decrypt
 * @param {string} secretKey - Secret key for decryption (defaults to env variable)
 * @returns {any} Decrypted data
 */
export const decryptData = (encryptedData, secretKey = process.env.REACT_APP_ENCRYPTION_KEY) => {
  if (!encryptedData) return null;
  if (!secretKey) {
    console.error('No encryption key provided');
    return null;
  }
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Securely store JWT token in localStorage with encryption
 * @param {string} token - JWT token to store
 */
export const storeAuthToken = (token) => {
  if (!token) return;
  
  try {
    const encryptedToken = encryptData(token);
    localStorage.setItem('pesaguru_auth_token', encryptedToken);
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

/**
 * Retrieve JWT token from localStorage and decrypt
 * @returns {string|null} Decrypted JWT token or null if not found
 */
export const getAuthToken = () => {
  try {
    const encryptedToken = localStorage.getItem('pesaguru_auth_token');
    if (!encryptedToken) return null;
    
    return decryptData(encryptedToken);
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeAuthToken = () => {
  try {
    localStorage.removeItem('pesaguru_auth_token');
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

/**
 * Check if current auth token is expired
 * @returns {boolean} True if token is expired or invalid
 */
export const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Generate a CSRF token for forms
 * @returns {string} CSRF token
 */
export const generateCSRFToken = () => {
  const token = Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
  
  // Store in sessionStorage
  sessionStorage.setItem('pesaguru_csrf_token', token);
  
  return token;
};

/**
 * Verify a CSRF token against stored token
 * @param {string} token - Token to verify
 * @returns {boolean} True if token is valid
 */
export const verifyCSRFToken = (token) => {
  const storedToken = sessionStorage.getItem('pesaguru_csrf_token');
  return token === storedToken;
};

/**
 * Mask national ID number for display
 * @param {string} idNumber - National ID to mask
 * @returns {string} Masked ID number
 */
export const maskNationalID = (idNumber) => {
  if (!idNumber) return '';
  
  const length = idNumber.length;
  if (length <= 4) return idNumber;
  
  const visiblePart = idNumber.slice(-4);
  const maskedPart = '*'.repeat(length - 4);
  
  return maskedPart + visiblePart;
};

/**
 * Detect if the user's connection is secure (HTTPS)
 * @returns {boolean} True if connection is secure
 */
export const isSecureConnection = () => {
  return window.location.protocol === 'https:';
};

/**
 * Check if the application is running in development environment
 * @returns {boolean} True if in development mode
 */
export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Log security events for monitoring/debugging
 * @param {string} event - Security event name
 * @param {Object} details - Event details
 */
export const logSecurityEvent = (event, details = {}) => {
  // In production, this could send logs to a monitoring service
  if (isDevelopmentMode()) {
    console.log(`[SECURITY] ${event}`, details);
  } else {
    // Here you could implement actual security logging to a backend service
    // For example: 
    // api.post('/security-logs', { event, details, timestamp: new Date() });
  }
};

/**
 * Validates input amount (for financial transactions)
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum allowed amount
 * @param {number} max - Maximum allowed amount
 * @returns {boolean} True if valid
 */
export const validateAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) return false;
  if (numAmount < min) return false;
  if (numAmount > max) return false;
  
  return true;
};