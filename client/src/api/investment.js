// src/api/investment.js
import apiClient from './client';

/**
 * Get personalized investment recommendations based on user preferences and risk profile
 * @param {Object} params - Investment recommendation parameters
 * @param {number} params.investment_amount - Amount to invest in KES
 * @param {string} params.risk_level - Risk level (conservative, moderate, aggressive)
 * @param {string} params.investment_horizon - Investment timeframe (short, medium, long)
 * @param {number} [params.goal_id] - Optional ID of a specific financial goal
 * @returns {Promise} - Promise resolving to investment recommendations
 */
export const getInvestmentRecommendations = (params) => {
  return apiClient.post('/investments/recommendations', params);
};

/**
 * Get current portfolio allocation breakdown
 * @returns {Promise} - Promise resolving to portfolio allocation data
 */
export const getPortfolioAllocation = () => {
  return apiClient.get('/investments/portfolio/allocation');
};

/**
 * Get detailed information about a specific stock
 * @param {string} symbol - Stock symbol (e.g., "SCOM" for Safaricom)
 * @param {string} [period='1y'] - Historical data period (1d, 1w, 1m, 3m, 6m, 1y, 5y)
 * @returns {Promise} - Promise resolving to stock details
 */
export const getStockDetails = (symbol, period = '1y') => {
  return apiClient.get(`/investments/stocks/${symbol}`, {
    params: { period }
  });
};

/**
 * Get trending stocks from NSE
 * @param {number} [limit=5] - Number of trending stocks to retrieve
 * @returns {Promise} - Promise resolving to trending stocks data
 */
export const getTrendingStocks = (limit = 5) => {
  return apiClient.get('/investments/stocks/trending', {
    params: { limit }
  });
};

/**
 * Get investment sector performance
 * @param {string} [period='1m'] - Period for sector performance (1w, 1m, 3m, 6m, 1y)
 * @returns {Promise} - Promise resolving to sector performance data
 */
export const getSectorPerformance = (period = '1m') => {
  return apiClient.get('/investments/sectors/performance', {
    params: { period }
  });
};

/**
 * Get risk assessment questionnaire
 * @returns {Promise} - Promise resolving to risk assessment questions
 */
export const getRiskAssessmentQuestions = () => {
  return apiClient.get('/investments/risk-assessment/questions');
};

/**
 * Submit risk assessment answers to calculate user's risk profile
 * @param {Array} answers - Array of answers to risk assessment questions
 * @returns {Promise} - Promise resolving to calculated risk profile
 */
export const submitRiskAssessment = (answers) => {
  return apiClient.post('/investments/risk-assessment/submit', { answers });
};

/**
 * Add a stock to user's watchlist
 * @param {string} symbol - Stock symbol to add
 * @returns {Promise} - Promise resolving to updated watchlist
 */
export const addToWatchlist = (symbol) => {
  return apiClient.post('/investments/watchlist/add', { symbol });
};

/**
 * Remove a stock from user's watchlist
 * @param {string} symbol - Stock symbol to remove
 * @returns {Promise} - Promise resolving to updated watchlist
 */
export const removeFromWatchlist = (symbol) => {
  return apiClient.delete(`/investments/watchlist/remove/${symbol}`);
};

/**
 * Get user's watchlist
 * @returns {Promise} - Promise resolving to user's watchlist
 */
export const getWatchlist = () => {
  return apiClient.get('/investments/watchlist');
};

// Create a named object before exporting
const investmentApi = {
  getInvestmentRecommendations,
  getPortfolioAllocation,
  getStockDetails,
  getTrendingStocks,
  getSectorPerformance,
  getRiskAssessmentQuestions,
  submitRiskAssessment,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
};

export default investmentApi;
