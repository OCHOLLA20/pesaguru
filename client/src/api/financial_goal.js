import apiClient from './client';

/**
 * Get all financial goals for the current user
 * @param {Object} options - Query options
 * @param {boolean} [options.includeCompleted=true] - Whether to include completed goals
 * @param {string} [options.sortBy='target_date'] - Sort field (target_date, name, priority, progress)
 * @param {string} [options.sortOrder='asc'] - Sort order (asc, desc)
 * @returns {Promise<Array>} List of financial goals
 */
export const getAllGoals = async (options = {}) => {
  try {
    const params = {
      include_completed: options.includeCompleted !== false,
      sort_by: options.sortBy || 'target_date',
      sort_order: options.sortOrder || 'asc'
    };
    
    const response = await apiClient.get('/financial-goals', { params });
    return response;
  } catch (error) {
    console.error('Error fetching financial goals:', error);
    throw error;
  }
};

/**
 * Get a specific financial goal by ID
 * @param {string|number} goalId - ID of the financial goal
 * @returns {Promise<Object>} Financial goal details
 */
export const getGoalById = async (goalId) => {
  try {
    const response = await apiClient.get(`/financial-goals/${goalId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching financial goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Create a new financial goal
 * @param {Object} goalData - Financial goal data
 * @param {string} goalData.name - Goal name
 * @param {string} goalData.description - Goal description
 * @param {number} goalData.target_amount - Target amount in KES
 * @param {string} goalData.target_date - Target date (YYYY-MM-DD)
 * @param {string} goalData.category - Goal category (e.g., "education", "home", "retirement", "vehicle")
 * @param {number} [goalData.current_amount=0] - Current amount saved
 * @param {string} [goalData.priority="medium"] - Priority level (low, medium, high)
 * @returns {Promise<Object>} Created financial goal
 */
export const createGoal = async (goalData) => {
  try {
    const response = await apiClient.post('/financial-goals', goalData);
    return response;
  } catch (error) {
    console.error('Error creating financial goal:', error);
    throw error;
  }
};

/**
 * Update an existing financial goal
 * @param {string|number} goalId - ID of the financial goal
 * @param {Object} goalData - Updated financial goal data
 * @returns {Promise<Object>} Updated financial goal
 */
export const updateGoal = async (goalId, goalData) => {
  try {
    const response = await apiClient.put(`/financial-goals/${goalId}`, goalData);
    return response;
  } catch (error) {
    console.error(`Error updating financial goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Delete a financial goal
 * @param {string|number} goalId - ID of the financial goal
 * @returns {Promise<Object>} Deletion response
 */
export const deleteGoal = async (goalId) => {
  try {
    const response = await apiClient.delete(`/financial-goals/${goalId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting financial goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Update progress for a financial goal
 * @param {string|number} goalId - ID of the financial goal
 * @param {Object} progressData - Progress update data
 * @param {number} progressData.current_amount - Current amount saved
 * @param {string} [progressData.note] - Optional note about this progress update
 * @returns {Promise<Object>} Updated goal with progress
 */
export const updateGoalProgress = async (goalId, progressData) => {
  try {
    const response = await apiClient.patch(`/financial-goals/${goalId}/progress`, progressData);
    return response;
  } catch (error) {
    console.error(`Error updating progress for goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Get progress history for a goal
 * @param {string|number} goalId - ID of the financial goal
 * @param {Object} options - Query options
 * @param {number} [options.limit=10] - Number of records to return
 * @returns {Promise<Array>} Progress history entries
 */
export const getGoalProgressHistory = async (goalId, options = {}) => {
  try {
    const params = {
      limit: options.limit || 10
    };
    
    const response = await apiClient.get(`/financial-goals/${goalId}/progress-history`, { params });
    return response;
  } catch (error) {
    console.error(`Error fetching progress history for goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Add a milestone to a financial goal
 * @param {string|number} goalId - ID of the financial goal
 * @param {Object} milestoneData - Milestone data
 * @param {string} milestoneData.title - Milestone title
 * @param {string} milestoneData.target_date - Target date (YYYY-MM-DD)
 * @param {number} [milestoneData.target_amount] - Optional target amount for this milestone
 * @param {string} [milestoneData.description] - Optional description
 * @returns {Promise<Object>} Created milestone
 */
export const addGoalMilestone = async (goalId, milestoneData) => {
  try {
    const response = await apiClient.post(`/financial-goals/${goalId}/milestones`, milestoneData);
    return response;
  } catch (error) {
    console.error(`Error adding milestone for goal ${goalId}:`, error);
    throw error;
  }
};

/**
 * Get available goal categories
 * @returns {Promise<Array>} List of goal categories with icons and descriptions
 */
export const getGoalCategories = async () => {
  try {
    const response = await apiClient.get('/financial-goals/categories');
    return response;
  } catch (error) {
    console.error('Error fetching goal categories:', error);
    throw error;
  }
};

/**
 * Generate a recommended savings plan for a goal
 * @param {string|number} goalId - ID of the financial goal
 * @returns {Promise<Object>} Savings plan with monthly contributions
 */
/**
 * Get goal achievement statistics and analytics
 * @returns {Promise<Object>} Statistics about goals completion and progress
 */
export const getGoalStatistics = async () => {
  try {
    const response = await apiClient.get('/financial-goals/statistics');
    return response;
  } catch (error) {
    console.error('Error fetching goal statistics:', error);
    throw error;
  }
};

/**
 * Generate a recommended savings plan for a goal
 * @param {string|number} goalId - ID of the financial goal
 * @returns {Promise<Object>} Savings plan with monthly contributions
 */
export const generateSavingsPlan = async (goalId) => {
  try {
    const response = await apiClient.get(`/financial-goals/${goalId}/savings-plan`);
    return response;
  } catch (error) {
    console.error(`Error generating savings plan for goal ${goalId}:`, error);
    throw error;
  }
};