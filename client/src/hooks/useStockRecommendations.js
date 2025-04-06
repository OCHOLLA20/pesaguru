import { useState, useEffect, useCallback } from 'react';
import { getStockRecommendations } from '../api/investment';

/**
 * Custom hook for fetching and managing stock recommendations
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to fetch recommendations on mount
 * @param {Object} options.defaultParams - Default parameters for the API call
 * @returns {Object} Stock recommendations data and functions
 */
const useStockRecommendations = ({ 
  autoFetch = true, 
  defaultParams = {} 
} = {}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch stock recommendations from the API
   * @param {Object} params - Parameters for the API call
   * @returns {Promise<Array>} - The stock recommendations
   */
  const fetchRecommendations = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Merge default params with any new params provided
      const mergedParams = { ...defaultParams, ...params };
      
      const data = await getStockRecommendations(mergedParams);
      setRecommendations(data);
      setLastUpdated(new Date());
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch stock recommendations';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [defaultParams]);

  /**
   * Filter recommendations by sector
   * @param {string} sector - The sector to filter by
   * @returns {Array} - Filtered recommendations
   */
  const filterBySector = useCallback((sector) => {
    if (!sector) return recommendations;
    return recommendations.filter(stock => stock.sector === sector);
  }, [recommendations]);

  /**
   * Filter recommendations by performance
   * @param {string} performance - The performance level ('high', 'medium', 'low')
   * @returns {Array} - Filtered recommendations
   */
  const filterByPerformance = useCallback((performance) => {
    if (!performance) return recommendations;
    
    return recommendations.filter(stock => {
      const growth = stock.projectedGrowth || 0;
      
      if (performance === 'high') return growth > 15;
      if (performance === 'medium') return growth >= 5 && growth <= 15;
      if (performance === 'low') return growth < 5;
      
      return true;
    });
  }, [recommendations]);

  /**
   * Sort recommendations by a specific field
   * @param {string} field - The field to sort by
   * @param {string} direction - The sort direction ('asc' or 'desc')
   * @returns {Array} - Sorted recommendations
   */
  const sortRecommendations = useCallback((field, direction = 'desc') => {
    if (!field) return recommendations;
    
    return [...recommendations].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];
      
      // Handle numeric values
      if (typeof valueA === 'string' && !isNaN(valueA)) {
        valueA = parseFloat(valueA);
      }
      
      if (typeof valueB === 'string' && !isNaN(valueB)) {
        valueB = parseFloat(valueB);
      }
      
      // Sort logic
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [recommendations]);

  // Fetch recommendations on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchRecommendations(defaultParams);
    }
  }, [autoFetch, fetchRecommendations, defaultParams]);

  return {
    recommendations,
    isLoading,
    error,
    lastUpdated,
    fetchRecommendations,
    filterBySector,
    filterByPerformance,
    sortRecommendations
  };
};

export default useStockRecommendations;
