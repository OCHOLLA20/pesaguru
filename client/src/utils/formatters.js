/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'KES')
 * @param {string} locale - Locale to use for formatting (default: 'en-KE')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'KES', locale = 'en-KE') => {
    if (amount === null || amount === undefined) return '-';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  /**
   * Format a number with commas and specified decimal places
   * @param {number} value - Number to format
   * @param {number} decimalPlaces - Number of decimal places (default: 2)
   * @param {string} locale - Locale to use for formatting (default: 'en-KE')
   * @returns {string} Formatted number string
   */
  export const formatNumber = (value, decimalPlaces = 2, locale = 'en-KE') => {
    if (value === null || value === undefined) return '-';
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(value);
  };
  
  /**
   * Format a value as a percentage
   * @param {number} value - Value to format as percentage (e.g., 0.25 for 25%)
   * @param {number} decimalPlaces - Number of decimal places (default: 2)
   * @param {string} locale - Locale to use for formatting (default: 'en-KE')
   * @returns {string} Formatted percentage string
   */
  export const formatPercentage = (value, decimalPlaces = 2, locale = 'en-KE') => {
    if (value === null || value === undefined) return '-';
    
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(value);
  };
  
  /**
   * Format a date
   * @param {Date|string|number} date - Date to format
   * @param {string} format - Format style: 'short', 'medium', 'long', 'full' (default: 'medium')
   * @param {string} locale - Locale to use for formatting (default: 'en-KE')
   * @returns {string} Formatted date string
   */
  export const formatDate = (date, format = 'medium', locale = 'en-KE') => {
    if (!date) return '-';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat(locale, {
      dateStyle: format
    }).format(dateObj);
  };
  
  /**
   * Format a time
   * @param {Date|string|number} time - Time to format
   * @param {string} format - Format style: 'short', 'medium', 'long', 'full' (default: 'short')
   * @param {string} locale - Locale to use for formatting (default: 'en-KE')
   * @returns {string} Formatted time string
   */
  export const formatTime = (time, format = 'short', locale = 'en-KE') => {
    if (!time) return '-';
    
    const timeObj = time instanceof Date ? time : new Date(time);
    
    if (isNaN(timeObj.getTime())) return 'Invalid time';
    
    return new Intl.DateTimeFormat(locale, {
      timeStyle: format
    }).format(timeObj);
  };
  
  /**
   * Format a date and time
   * @param {Date|string|number} datetime - Datetime to format
   * @param {string} dateFormat - Date format style (default: 'medium')
   * @param {string} timeFormat - Time format style (default: 'short')
   * @param {string} locale - Locale to use for formatting (default: 'en-KE')
   * @returns {string} Formatted datetime string
   */
  export const formatDateTime = (
    datetime, 
    dateFormat = 'medium', 
    timeFormat = 'short',
    locale = 'en-KE'
  ) => {
    if (!datetime) return '-';
    
    const datetimeObj = datetime instanceof Date ? datetime : new Date(datetime);
    
    if (isNaN(datetimeObj.getTime())) return 'Invalid datetime';
    
    return new Intl.DateTimeFormat(locale, {
      dateStyle: dateFormat,
      timeStyle: timeFormat
    }).format(datetimeObj);
  };
  
  /**
   * Format a Kenyan phone number
   * @param {string} phoneNumber - Phone number to format
   * @param {boolean} includeCountryCode - Whether to include the country code (default: true)
   * @returns {string} Formatted phone number
   */
  export const formatPhoneNumber = (phoneNumber, includeCountryCode = true) => {
    if (!phoneNumber) return '-';
    
    // Remove any non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different Kenyan number formats
    let formatted;
    
    if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
      // Format as 0XXX XXX XXX (without country code)
      formatted = `0${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;
      if (includeCountryCode) {
        formatted = `+254 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;
      }
    } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
      // Format as 0XXX XXX XXX (with leading 0)
      formatted = `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 10)}`;
      if (includeCountryCode) {
        formatted = `+254 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 10)}`;
      }
    } else if (cleaned.length === 12 && cleaned.startsWith('254')) {
      // Format as +254 XXX XXX XXX (with country code)
      formatted = `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9, 12)}`;
      if (!includeCountryCode) {
        formatted = `0${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9, 12)}`;
      }
    } else {
      // Return as is if it doesn't match expected formats
      formatted = phoneNumber;
    }
    
    return formatted;
  };
  
  /**
   * Truncate text with ellipsis if it exceeds the specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncation (default: 100)
   * @param {string} ellipsis - String to append after truncation (default: '...')
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 100, ellipsis = '...') => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}${ellipsis}`;
  };
  
  /**
   * Format a file size
   * @param {number} bytes - Size in bytes
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} Formatted file size
   */
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };
  
  /**
   * Format account numbers for display (mask all but last 4 digits)
   * @param {string} accountNumber - Account number to mask
   * @returns {string} Masked account number
   */
  export const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return '-';
    
    const visibleDigits = 4;
    const length = accountNumber.length;
    
    if (length <= visibleDigits) return accountNumber;
    
    const maskedPortion = '*'.repeat(length - visibleDigits);
    const visiblePortion = accountNumber.slice(length - visibleDigits);
    
    return `${maskedPortion}${visiblePortion}`;
  };