import apiClient from './client';

/**
 * Login user with email and password
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} User data and access token
 */
export const loginUser = async (credentials) => {
  try {
    // The API expects username/password format for OAuth2 compatibility
    const formData = {
      username: credentials.email,
      password: credentials.password,
    };
    
    const response = await apiClient.post('/auth/token', formData);
    
    // Store the token in localStorage
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.full_name - User's full name
 * @param {string} userData.phone_number - User's phone number
 * @param {string} userData.preferred_language - User's preferred language (en/sw)
 * @returns {Promise<Object>} Registered user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Get current user profile data
 * @returns {Promise<Object>} Current user profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    // If we get a 401, clear the token as it's likely expired
    if (error.status === 401) {
      localStorage.removeItem('token');
    }
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} Logout response
 */
export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    // Remove token from localStorage regardless of response
    localStorage.removeItem('token');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Remove token even if API call fails
    localStorage.removeItem('token');
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset request response
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Reset data
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.password - New password
 * @returns {Promise<Object>} Reset response
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await apiClient.post('/auth/reset-password', resetData);
    return response;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Update user's preferred language
 * @param {string} language - Language code (en/sw)
 * @returns {Promise<Object>} Update response
 */
export const updateLanguagePreference = async (language) => {
  try {
    const response = await apiClient.post('/users/preferences/language', { language });
    return response;
  } catch (error) {
    console.error('Language preference update error:', error);
    throw error;
  }
};