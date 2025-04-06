import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for managing loan data and operations
 * @returns {Object} Loan data and functions
 */
const useLoans = () => {
  const { isAuthenticated } = useAuth();
  const [loans, setLoans] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API base URL - should be environment variable in production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  /**
   * Fetch available loan options
   * @param {Object} params - Query parameters for filtering loans
   * @returns {Promise<Array>} - Available loans
   */
  const fetchAvailableLoans = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (params.amount) queryParams.append('amount', params.amount);
      if (params.term) queryParams.append('term', params.term);
      if (params.purpose) queryParams.append('purpose', params.purpose);
      if (params.minRate) queryParams.append('minRate', params.minRate);
      if (params.maxRate) queryParams.append('maxRate', params.maxRate);
      
      const response = await axios.get(`${API_URL}/loans/available?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setLoans(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch available loans';
      setError(errorMsg);
      console.error('Loan fetch error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /**
   * Fetch user's existing loans
   * @returns {Promise<Array>} - User's loans
   */
  const fetchUserLoans = useCallback(async () => {
    if (!isAuthenticated) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/loans/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUserLoans(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch your loans';
      setError(errorMsg);
      console.error('User loans fetch error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Apply for a new loan
   * @param {Object} loanData - Loan application data
   * @returns {Promise<Object>} - Application result
   */
  const applyForLoan = useCallback(async (loanData) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to apply for a loan');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/loans/apply`, loanData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Add the new loan to the user's loans
      setUserLoans(prev => [...prev, response.data]);
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit loan application';
      setError(errorMsg);
      console.error('Loan application error:', err);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Calculate loan details based on parameters
   * @param {Object} params - Loan parameters
   * @param {number} params.amount - Loan amount
   * @param {number} params.interestRate - Annual interest rate (percentage)
   * @param {number} params.term - Loan term in months
   * @returns {Object} - Calculated loan details
   */
  const calculateLoanDetails = useCallback(({ amount, interestRate, term }) => {
    if (!amount || !interestRate || !term) {
      return null;
    }

    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate monthly payment using the formula: P = (r*PV)/(1-(1+r)^-n)
    // Where P = payment, PV = present value, r = rate per period, n = number of periods
    const monthlyPayment = (monthlyRate * amount) / (1 - Math.pow(1 + monthlyRate, -term));
    
    // Calculate total repayment
    const totalRepayment = monthlyPayment * term;
    
    // Calculate total interest
    const totalInterest = totalRepayment - amount;
    
    return {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalRepayment: parseFloat(totalRepayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      interestRate,
      term,
      amount
    };
  }, []);

  /**
   * Compare multiple loans to find the best option
   * @param {Array} loanOptions - Array of loan options to compare
   * @param {string} priorityFactor - Factor to prioritize ('interest', 'monthly', 'total')
   * @returns {Object} - Best loan option based on priority factor
   */
  const findBestLoanOption = useCallback((loanOptions, priorityFactor = 'interest') => {
    if (!loanOptions || loanOptions.length === 0) {
      return null;
    }

    let bestLoan;

    switch (priorityFactor) {
      case 'interest':
        // Find loan with lowest interest rate
        bestLoan = loanOptions.reduce((prev, current) => 
          prev.interestRate < current.interestRate ? prev : current
        );
        break;
      
      case 'monthly':
        // Find loan with lowest monthly payment
        bestLoan = loanOptions.reduce((prev, current) => 
          prev.monthlyPayment < current.monthlyPayment ? prev : current
        );
        break;
      
      case 'total':
        // Find loan with lowest total repayment
        bestLoan = loanOptions.reduce((prev, current) => 
          prev.totalRepayment < current.totalRepayment ? prev : current
        );
        break;
      
      default:
        // Default to lowest interest rate
        bestLoan = loanOptions.reduce((prev, current) => 
          prev.interestRate < current.interestRate ? prev : current
        );
    }

    return bestLoan;
  }, []);

  // Load user's loans when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserLoans();
    }
  }, [isAuthenticated, fetchUserLoans]);

  return {
    loans,
    userLoans,
    isLoading,
    error,
    fetchAvailableLoans,
    fetchUserLoans,
    applyForLoan,
    calculateLoanDetails,
    findBestLoanOption
  };
};

export default useLoans;
