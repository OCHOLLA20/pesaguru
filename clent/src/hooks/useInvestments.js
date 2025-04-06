import { useState, useEffect, useCallback } from 'react';
import { 
  getInvestmentRecommendations, 
  getPortfolioAllocation,
  getStockDetails 
} from '../api/investment';

/**
 * Custom hook for managing investment data and recommendations in PesaGuru
 * Provides portfolio data, investment recommendations, and stock details
 */
const useInvestments = (defaultParams = {}) => {
  // State for investment recommendations
  const [recommendations, setRecommendations] = useState([]);
  
  // State for portfolio allocation data
  const [portfolio, setPortfolio] = useState(null);
  
  // Tracking loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Error handling
  const [error, setError] = useState(null);

  /**
   * Fetch investment recommendations based on parameters
   * @param {Object} params - Parameters for recommendation (risk level, amount, etc.)
   * @returns {Promise} - Resolves to recommendations data
   */
  const fetchRecommendations = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Merge default params with any new params provided
      const mergedParams = { ...defaultParams, ...params };
      
      const data = await getInvestmentRecommendations(mergedParams);
      setRecommendations(data);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch investment recommendations';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [defaultParams]);

  /**
   * Fetch the user's portfolio allocation data
   * @returns {Promise} - Resolves to portfolio data
   */
  const fetchPortfolio = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPortfolioAllocation();
      setPortfolio(data);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch portfolio data';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch detailed information about a specific stock
   * @param {string} symbol - Stock symbol
   * @param {string} period - Time period for historical data (e.g., '1d', '1w', '1m', '1y')
   * @returns {Promise} - Resolves to stock data
   */
  const fetchStockDetails = useCallback(async (symbol, period = '1y') => {
    if (!symbol) {
      setError('Stock symbol is required');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      const data = await getStockDetails(symbol, period);
      return data;
    } catch (err) {
      const errorMsg = err.message || `Failed to fetch data for ${symbol}`;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Calculate potential returns based on investment amount and recommendation data
   * @param {number} amount - Investment amount
   * @param {Object} recommendation - Recommendation data
   * @returns {Object} - Calculated potential returns
   */
  const calculatePotentialReturns = useCallback((amount, recommendation) => {
    if (!recommendation || !amount) return null;
    
    const { historicalReturn, riskLevel } = recommendation;
    
    // Simple calculation based on historical returns
    // In real app, would use more sophisticated models
    const conservativeReturn = amount * (historicalReturn * 0.7);
    const expectedReturn = amount * historicalReturn;
    const optimisticReturn = amount * (historicalReturn * 1.3);
    
    return {
      conservative: conservativeReturn,
      expected: expectedReturn,
      optimistic: optimisticReturn,
      timeHorizon: recommendation.recommendedHorizon || '1y'
    };
  }, []);

  // Load data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch both portfolio and recommendations in parallel
        await Promise.all([
          fetchPortfolio(),
          fetchRecommendations(defaultParams)
        ]);
      } catch (err) {
        console.error('Failed to load investment data:', err);
      }
    };

    loadInitialData();
  }, [fetchPortfolio, fetchRecommendations, defaultParams]);

  return {
    recommendations,
    portfolio,
    isLoading,
    error,
    fetchRecommendations,
    fetchPortfolio,
    fetchStockDetails,
    calculatePotentialReturns
  };
};

export default useInvestments;