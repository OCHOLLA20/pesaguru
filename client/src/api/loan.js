// src/api/loan.js
import apiClient from './client';

/**
 * Compare different loan options based on specified parameters
 * @param {Object} params - Loan comparison parameters
 * @param {number} params.amount - Loan amount in KES
 * @param {number} params.duration - Loan duration in months
 * @param {string} [params.purpose] - Purpose of the loan (business, education, personal, home, etc.)
 * @param {number} [params.maxInterestRate] - Maximum interest rate to consider
 * @returns {Promise} - Promise resolving to compared loan options
 */
export const compareLoanOptions = (params) => {
  return apiClient.post('/loans/compare', params);
};

/**
 * Calculate loan EMI (Equated Monthly Installment)
 * @param {Object} params - Loan calculation parameters
 * @param {number} params.principal - Principal loan amount in KES
 * @param {number} params.interestRate - Annual interest rate (percentage)
 * @param {number} params.tenure - Loan tenure in months
 * @returns {Promise} - Promise resolving to EMI calculation details
 */
export const calculateLoanEMI = (params) => {
  return apiClient.post('/loans/calculate-emi', params);
};

/**
 * Get amortization schedule for a loan
 * @param {Object} params - Loan parameters
 * @param {number} params.principal - Principal loan amount in KES
 * @param {number} params.interestRate - Annual interest rate (percentage)
 * @param {number} params.tenure - Loan tenure in months
 * @returns {Promise} - Promise resolving to loan amortization schedule
 */
export const getLoanAmortizationSchedule = (params) => {
  return apiClient.post('/loans/amortization-schedule', params);
};

/**
 * Check loan eligibility
 * @param {Object} params - Eligibility check parameters
 * @param {number} params.monthlyIncome - Monthly income in KES
 * @param {number} params.monthlyExpenses - Monthly expenses in KES
 * @param {number} [params.existingEMIs] - Existing EMI payments
 * @param {number} [params.creditScore] - Credit score if available
 * @returns {Promise} - Promise resolving to eligibility results
 */
export const checkLoanEligibility = (params) => {
  return apiClient.post('/loans/check-eligibility', params);
};

/**
 * Get personalized loan recommendations
 * @param {Object} [params] - Optional parameters to filter recommendations
 * @param {string} [params.purpose] - Loan purpose
 * @param {number} [params.maxAmount] - Maximum loan amount
 * @returns {Promise} - Promise resolving to loan recommendations
 */
export const getLoanRecommendations = (params = {}) => {
  return apiClient.get('/loans/recommendations', { params });
};

/**
 * Get available loan types and their details
 * @returns {Promise} - Promise resolving to loan types information
 */
export const getLoanTypes = () => {
  return apiClient.get('/loans/types');
};

/**
 * Get current interest rates from various lenders
 * @param {string} [loanType] - Optional filter by loan type
 * @returns {Promise} - Promise resolving to current interest rates
 */
export const getCurrentInterestRates = (loanType) => {
  const params = loanType ? { type: loanType } : {};
  return apiClient.get('/loans/interest-rates', { params });
};

/**
 * Submit a loan application
 * @param {Object} application - Loan application details
 * @returns {Promise} - Promise resolving to application submission status
 */
export const submitLoanApplication = (application) => {
  return apiClient.post('/loans/apply', application);
};

/**
 * Get user's loan history
 * @param {Object} [params] - Optional filtering parameters
 * @param {string} [params.status] - Filter by loan status (active, closed, pending)
 * @returns {Promise} - Promise resolving to user's loan history
 */
export const getUserLoanHistory = (params = {}) => {
  return apiClient.get('/loans/history', { params });
};

/**
 * Get details of a specific loan
 * @param {string} loanId - ID of the loan
 * @returns {Promise} - Promise resolving to loan details
 */
export const getLoanDetails = (loanId) => {
  return apiClient.get(`/loans/${loanId}`);
};

/**
 * Get loan prepayment details
 * @param {string} loanId - ID of the loan
 * @param {number} prepaymentAmount - Amount to be prepaid
 * @returns {Promise} - Promise resolving to prepayment impact details
 */
export const getLoanPrepaymentDetails = (loanId, prepaymentAmount) => {
  return apiClient.get(`/loans/${loanId}/prepayment`, {
    params: { amount: prepaymentAmount }
  });
};

export default {
  compareLoanOptions,
  calculateLoanEMI,
  getLoanAmortizationSchedule,
  checkLoanEligibility,
  getLoanRecommendations,
  getLoanTypes,
  getCurrentInterestRates,
  submitLoanApplication,
  getUserLoanHistory,
  getLoanDetails,
  getLoanPrepaymentDetails
};