// src/api/user.js
import apiClient from './client';

/**
 * Get the current user's profile information
 * @returns {Promise} - Promise resolving to user profile data
 */
export const getUserProfile = () => {
  return apiClient.get('/users/profile');
};

/**
 * Update user profile information
 * @param {Object} profileData - Updated profile data
 * @param {string} [profileData.full_name] - User's full name
 * @param {string} [profileData.phone_number] - User's phone number
 * @param {string} [profileData.preferred_language] - Preferred language (en/sw)
 * @param {number} [profileData.monthly_income] - Monthly income in KES
 * @param {number} [profileData.monthly_expenses] - Monthly expenses in KES
 * @returns {Promise} - Promise resolving to updated user profile
 */
export const updateUserProfile = (profileData) => {
  return apiClient.put('/users/profile', profileData);
};

/**
 * Update user's profile picture
 * @param {FormData} formData - FormData object containing the image file
 * @returns {Promise} - Promise resolving to updated profile with image URL
 */
export const updateProfilePicture = (formData) => {
  return apiClient.post('/users/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * Change user's password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.current_password - Current password
 * @param {string} passwordData.new_password - New password
 * @returns {Promise} - Promise resolving to success message
 */
export const changePassword = (passwordData) => {
  return apiClient.post('/users/password/change', passwordData);
};

/**
 * Request password reset email
 * @param {Object} data - Email data
 * @param {string} data.email - User's email address
 * @returns {Promise} - Promise resolving to success message
 */
export const requestPasswordReset = (data) => {
  return apiClient.post('/users/password/reset-request', data);
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.token - Reset token from email
 * @param {string} resetData.new_password - New password
 * @returns {Promise} - Promise resolving to success message
 */
export const resetPassword = (resetData) => {
  return apiClient.post('/users/password/reset', resetData);
};

/**
 * Get user's financial goals
 * @returns {Promise} - Promise resolving to list of financial goals
 */
export const getFinancialGoals = () => {
  return apiClient.get('/users/goals');
};

/**
 * Create a new financial goal
 * @param {Object} goalData - Financial goal data
 * @param {string} goalData.name - Goal name
 * @param {string} goalData.description - Goal description
 * @param {number} goalData.target_amount - Target amount in KES
 * @param {string} goalData.target_date - Target date (YYYY-MM-DD)
 * @param {string} goalData.goal_type - Type of goal (education, retirement, home, etc.)
 * @param {number} [goalData.current_amount] - Current amount saved toward goal
 * @returns {Promise} - Promise resolving to created goal
 */
export const createFinancialGoal = (goalData) => {
  return apiClient.post('/users/goals', goalData);
};

/**
 * Update an existing financial goal
 * @param {number} goalId - ID of the goal to update
 * @param {Object} goalData - Updated goal data
 * @returns {Promise} - Promise resolving to updated goal
 */
export const updateFinancialGoal = (goalId, goalData) => {
  return apiClient.put(`/users/goals/${goalId}`, goalData);
};

/**
 * Delete a financial goal
 * @param {number} goalId - ID of the goal to delete
 * @returns {Promise} - Promise resolving to success message
 */
export const deleteFinancialGoal = (goalId) => {
  return apiClient.delete(`/users/goals/${goalId}`);
};

/**
 * Track progress for a financial goal
 * @param {number} goalId - ID of the goal
 * @param {Object} progressData - Progress data
 * @param {number} progressData.amount - Amount to add to goal progress
 * @param {string} [progressData.note] - Optional note about the contribution
 * @returns {Promise} - Promise resolving to updated goal with progress
 */
export const trackGoalProgress = (goalId, progressData) => {
  return apiClient.post(`/users/goals/${goalId}/progress`, progressData);
};

/**
 * Get user's risk profile
 * @returns {Promise} - Promise resolving to user's risk profile
 */
export const getUserRiskProfile = () => {
  return apiClient.get('/users/risk-profile');
};

/**
 * Update user's risk profile
 * @param {Object} riskData - Risk profile data
 * @param {string} riskData.risk_profile - Risk profile (conservative, moderate, aggressive)
 * @returns {Promise} - Promise resolving to updated user with risk profile
 */
export const updateRiskProfile = (riskData) => {
  return apiClient.put('/users/risk-profile', riskData);
};

/**
 * Get user's notification preferences
 * @returns {Promise} - Promise resolving to notification preferences
 */
export const getNotificationPreferences = () => {
  return apiClient.get('/users/preferences/notifications');
};

/**
 * Update notification preferences
 * @param {Object} preferences - Notification preferences
 * @param {boolean} [preferences.email_notifications] - Enable email notifications
 * @param {boolean} [preferences.push_notifications] - Enable push notifications
 * @param {boolean} [preferences.sms_notifications] - Enable SMS notifications
 * @param {Object} [preferences.notification_types] - Specific notification type preferences
 * @returns {Promise} - Promise resolving to updated preferences
 */
export const updateNotificationPreferences = (preferences) => {
  return apiClient.put('/users/preferences/notifications', preferences);
};

/**
 * Get user's language preference
 * @returns {Promise} - Promise resolving to language preference
 */
export const getLanguagePreference = () => {
  return apiClient.get('/users/preferences/language');
};

/**
 * Update language preference
 * @param {Object} data - Language preference data
 * @param {string} data.language - Language code (en, sw)
 * @returns {Promise} - Promise resolving to updated preference
 */
export const updateLanguagePreference = (data) => {
  return apiClient.put('/users/preferences/language', data);
};

/**
 * Get user's linked accounts (banks, mobile money)
 * @returns {Promise} - Promise resolving to linked accounts
 */
export const getLinkedAccounts = () => {
  return apiClient.get('/users/linked-accounts');
};

/**
 * Link a new account
 * @param {Object} accountData - Account data
 * @param {string} accountData.account_type - Account type (bank, mobile_money)
 * @param {string} accountData.account_name - Account name/label
 * @param {string} [accountData.account_number] - Account number
 * @param {string} [accountData.bank_code] - Bank code (for bank accounts)
 * @param {string} [accountData.phone_number] - Phone number (for mobile money)
 * @returns {Promise} - Promise resolving to linked account data
 */
export const linkAccount = (accountData) => {
  return apiClient.post('/users/linked-accounts', accountData);
};

/**
 * Unlink an account
 * @param {number} accountId - ID of account to unlink
 * @returns {Promise} - Promise resolving to success message
 */
export const unlinkAccount = (accountId) => {
  return apiClient.delete(`/users/linked-accounts/${accountId}`);
};

/**
 * Get user activity log
 * @param {Object} [params] - Optional parameters
 * @param {number} [params.limit=20] - Number of records to retrieve
 * @param {number} [params.offset=0] - Offset for pagination
 * @param {string} [params.activity_type] - Filter by activity type
 * @returns {Promise} - Promise resolving to activity logs
 */
export const getActivityLog = (params = {}) => {
  return apiClient.get('/users/activity-log', { params });
};

/**
 * Get user feedback history
 * @returns {Promise} - Promise resolving to user's feedback history
 */
export const getFeedbackHistory = () => {
  return apiClient.get('/users/feedback');
};

/**
 * Submit user feedback
 * @param {Object} feedbackData - Feedback data
 * @param {string} feedbackData.category - Feedback category
 * @param {string} feedbackData.message - Feedback message
 * @param {number} [feedbackData.rating] - Rating (1-5)
 * @returns {Promise} - Promise resolving to submitted feedback
 */
export const submitFeedback = (feedbackData) => {
  return apiClient.post('/users/feedback', feedbackData);
};

export default {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  changePassword,
  requestPasswordReset,
  resetPassword,
  getFinancialGoals,
  createFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
  trackGoalProgress,
  getUserRiskProfile,
  updateRiskProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
  getLanguagePreference,
  updateLanguagePreference,
  getLinkedAccounts,
  linkAccount,
  unlinkAccount,
  getActivityLog,
  getFeedbackHistory,
  submitFeedback
};