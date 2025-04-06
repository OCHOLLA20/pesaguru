/**
 * validators.js - Form validation utilities for PesaGuru
 * 
 * Contains validation functions for various form inputs including:
 * - Email validation
 * - Password complexity
 * - Kenyan phone numbers
 * - Financial amounts
 * - Investment validation
 */

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email is valid
 */
export const validateEmail = (email) => {
    // RFC 5322 compliant email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(String(email).toLowerCase());
  };
  
  /**
   * Validates password complexity
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Validates Kenyan phone number format
   * Accepts formats: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 01XXXXXXXX
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Whether phone number is valid
   */
  export const validateKenyanPhone = (phone) => {
    if (!phone) return false;
    
    // Remove spaces and hyphens for validation
    const cleanedPhone = phone.replace(/[\s-]/g, '');
    
    // Check for valid Kenyan formats
    // +254 format (international)
    const intlFormat = /^\+254[17]\d{8}$/;
    
    // 254 format (without +)
    const altIntlFormat = /^254[17]\d{8}$/;
    
    // Local format starting with 07 or 01
    const localFormat = /^0[17]\d{8}$/;
    
    return intlFormat.test(cleanedPhone) || 
           altIntlFormat.test(cleanedPhone) || 
           localFormat.test(cleanedPhone);
  };
  
  /**
   * Alias for validateKenyanPhone for backward compatibility
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Whether phone number is valid
   */
  export const validatePhone = (phone) => {
    return validateKenyanPhone(phone);
  };
  
  /**
   * Formats a Kenyan phone number to standard format
   * @param {string} phone - Phone number to format
   * @returns {string} - Formatted phone number or original if invalid
   */
  export const formatKenyanPhone = (phone) => {
    if (!validateKenyanPhone(phone)) return phone;
    
    // Clean the phone number
    const cleaned = phone.replace(/[\s-]/g, '');
    
    // Convert to international format
    if (/^0[17]\d{8}$/.test(cleaned)) {
      // Convert from 07XXXXXXXX to +254 7XXXXXXXX
      return '+254 ' + cleaned.substring(1, 2) + ' ' + cleaned.substring(2);
    } else if (/^254[17]\d{8}$/.test(cleaned)) {
      // Convert from 254XXXXXXXXX to +254 XXXXXXXXX
      return '+' + cleaned.substring(0, 3) + ' ' + cleaned.substring(3, 4) + ' ' + cleaned.substring(4);
    } else if (/^\+254[17]\d{8}$/.test(cleaned)) {
      // Already in international format, just add spacing
      return cleaned.substring(0, 4) + ' ' + cleaned.substring(4, 5) + ' ' + cleaned.substring(5);
    }
    
    return phone;
  };
  
  /**
   * Validates a monetary amount in Kenyan Shillings (KES)
   * @param {string|number} amount - Amount to validate
   * @param {number} min - Minimum allowed amount (default: 0)
   * @param {number} max - Maximum allowed amount (default: Number.MAX_SAFE_INTEGER)
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validateAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    // Convert to number if string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    
    if (isNaN(numericAmount)) {
      return { isValid: false, message: 'Amount must be a valid number' };
    }
    
    if (numericAmount < min) {
      return { isValid: false, message: `Amount must be at least KES ${min.toLocaleString()}` };
    }
    
    if (numericAmount > max) {
      return { isValid: false, message: `Amount must be less than KES ${max.toLocaleString()}` };
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Validates an investment amount (Minimum KES 1,000)
   * @param {string|number} amount - Amount to validate
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validateInvestmentAmount = (amount) => {
    return validateAmount(amount, 1000);
  };
  
  /**
   * Validates a loan amount (Minimum KES 5,000, Maximum KES 10,000,000)
   * @param {string|number} amount - Amount to validate
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validateLoanAmount = (amount) => {
    return validateAmount(amount, 5000, 10000000);
  };
  
  /**
   * Validates income amount (Minimum KES 0)
   * @param {string|number} amount - Amount to validate
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validateIncomeAmount = (amount) => {
    return validateAmount(amount, 0);
  };
  
  /**
   * Validates expense amount (Minimum KES 0)
   * @param {string|number} amount - Amount to validate
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validateExpenseAmount = (amount) => {
    return validateAmount(amount, 0);
  };
  
  /**
   * Validates a risk profile value
   * @param {string} profile - Risk profile to validate
   * @returns {boolean} - Whether profile is valid
   */
  export const validateRiskProfile = (profile) => {
    const validProfiles = ['conservative', 'moderate', 'aggressive'];
    return validProfiles.includes(profile);
  };
  
  /**
   * Validates investment time horizon
   * @param {string} horizon - Time horizon to validate
   * @returns {boolean} - Whether horizon is valid
   */
  export const validateTimeHorizon = (horizon) => {
    const validHorizons = ['short', 'medium', 'long'];
    return validHorizons.includes(horizon);
  };
  
  /**
   * Validates a financial goal
   * @param {Object} goal - Financial goal object to validate
   * @returns {Object} - Validation result with errors object
   */
  export const validateFinancialGoal = (goal) => {
    const errors = {};
    
    if (!goal.name || goal.name.trim() === '') {
      errors.name = 'Goal name is required';
    }
    
    if (!goal.targetAmount) {
      errors.targetAmount = 'Target amount is required';
    } else {
      const amountValidation = validateAmount(goal.targetAmount, 1000);
      if (!amountValidation.isValid) {
        errors.targetAmount = amountValidation.message;
      }
    }
    
    if (!goal.targetDate) {
      errors.targetDate = 'Target date is required';
    } else {
      const targetDate = new Date(goal.targetDate);
      const today = new Date();
      if (targetDate <= today) {
        errors.targetDate = 'Target date must be in the future';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates a date to ensure it's in the future
   * @param {string|Date} date - Date to validate
   * @returns {boolean} - Whether date is valid and in the future
   */
  export const validateFutureDate = (date) => {
    if (!date) return false;
    
    const inputDate = new Date(date);
    const today = new Date();
    
    // Clear time portion for comparing just the dates
    today.setHours(0, 0, 0, 0);
    
    return !isNaN(inputDate.getTime()) && inputDate >= today;
  };
  
  /**
   * Validates a name or full name
   * @param {string} name - Name to validate
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validateName = (name) => {
    if (!name || name.trim() === '') {
      return { isValid: false, message: 'Name is required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters' };
    }
    
    // Check if name contains only letters, spaces, hyphens and apostrophes
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, message: 'Name contains invalid characters' };
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Validates required field is not empty
   * @param {any} value - Value to check
   * @param {string} fieldName - Name of the field for error message
   * @returns {Object} - Validation result with isValid flag and error message
   */
  export const validateRequired = (value, fieldName) => {
    if (value === undefined || value === null || value === '') {
      return { isValid: false, message: `${fieldName} is required` };
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return { isValid: false, message: `${fieldName} is required` };
    }
    
    return { isValid: true, message: '' };
  };
  
  /**
   * Validates a complete login form
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result with isValid flag and errors object
   */
  export const validateLoginForm = (formData) => {
    const errors = {};
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates a complete registration form
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result with isValid flag and errors object
   */
  export const validateRegistrationForm = (formData) => {
    const errors = {};
    
    const nameValidation = validateName(formData.fullName);
    if (!nameValidation.isValid) {
      errors.fullName = nameValidation.message;
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!validateKenyanPhone(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid Kenyan phone number';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates an investment form
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result with isValid flag and errors object
   */
  export const validateInvestmentForm = (formData) => {
    const errors = {};
    
    const amountValidation = validateInvestmentAmount(formData.investmentAmount);
    if (!amountValidation.isValid) {
      errors.investmentAmount = amountValidation.message;
    }
    
    if (!validateRiskProfile(formData.riskLevel)) {
      errors.riskLevel = 'Please select a valid risk level';
    }
    
    if (!validateTimeHorizon(formData.investmentHorizon)) {
      errors.investmentHorizon = 'Please select a valid investment horizon';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validates a loan form
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Validation result with isValid flag and errors object
   */
  export const validateLoanForm = (formData) => {
    const errors = {};
    
    const amountValidation = validateLoanAmount(formData.loanAmount);
    if (!amountValidation.isValid) {
      errors.loanAmount = amountValidation.message;
    }
    
    if (!formData.loanPurpose || formData.loanPurpose.trim() === '') {
      errors.loanPurpose = 'Loan purpose is required';
    }
    
    if (!formData.loanTerm || isNaN(parseInt(formData.loanTerm)) || parseInt(formData.loanTerm) <= 0) {
      errors.loanTerm = 'Please enter a valid loan term';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
// Create a named object for export
const validators = {
  validateEmail,
  validatePassword,
  validateKenyanPhone,
  validatePhone,
  formatKenyanPhone,
  validateAmount,
  validateInvestmentAmount,
  validateLoanAmount,
  validateIncomeAmount,
  validateExpenseAmount,
  validateRiskProfile,
  validateTimeHorizon,
  validateFinancialGoal,
  validateFutureDate,
  validateName,
  validateRequired,
  validateLoginForm,
  validateRegistrationForm,
  validateInvestmentForm,
  validateLoanForm
};

export default validators;
