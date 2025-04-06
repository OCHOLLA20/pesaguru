import axios from 'axios';

// Get the API URL from environment variables, with a fallback for development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Create an axios instance with custom configuration
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

/**
 * Request interceptor for adding auth token and other common headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language preference if available
    const language = localStorage.getItem('preferredLanguage') || 'en';
    config.headers['Accept-Language'] = language;
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling common error cases and standardizing responses
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  (error) => {
    // Check if the error is a response error
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle different status codes
      switch (status) {
        case 401: // Unauthorized
          // Clear token from localStorage for auth errors
          localStorage.removeItem('token');
          
          // You might want to redirect to login page here
          // If you're using react-router, import and use navigate
          // navigate('/login');
          
          console.warn('Authentication failed - please log in again');
          break;
          
        case 403: // Forbidden
          console.warn('You do not have permission to access this resource');
          break;
          
        case 429: // Too Many Requests
          console.warn('Rate limit exceeded. Please try again later.');
          break;
          
        case 500: // Server Error
          console.error('Server error occurred. Please try again later.');
          break;
          
        default:
          // Handle other status codes
          break;
      }
      
      // Standardize error response
      return Promise.reject({
        status,
        message: data.detail || data.message || 'An error occurred',
        errors: data.errors || {},
        data: data
      });
    }
    
    // Handle network errors (when no response is received)
    if (error.request) {
      console.error('Network Error: No response received from server');
      
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection and try again.',
        errors: {}
      });
    }
    
    // Handle other errors
    console.error('API Error:', error.message);
    return Promise.reject({
      status: 0,
      message: error.message || 'An unknown error occurred',
      errors: {}
    });
  }
);

/**
 * Helper method for uploading files
 * @param {string} url - API endpoint
 * @param {FormData} formData - The form data with files
 * @param {Object} config - Additional config options
 * @returns {Promise} API response
 */
apiClient.uploadFile = (url, formData, config = {}) => {
  return apiClient.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Helper method for downloading files
 * @param {string} url - API endpoint
 * @param {Object} params - Query parameters
 * @param {Object} config - Additional config options
 * @returns {Promise} API response
 */
apiClient.downloadFile = (url, params = {}, config = {}) => {
  return apiClient.get(url, {
    ...config,
    params,
    responseType: 'blob',
  });
};

export default apiClient;