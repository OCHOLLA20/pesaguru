// src/hooks/useMarketData.js

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook for fetching and managing market data from various financial sources
 * Supports NSE stocks, CBK rates, forex, and cryptocurrency data
 */
const useMarketData = () => {
  const [stockData, setStockData] = useState([]);
  const [cbkRates, setCbkRates] = useState({});
  const [forexRates, setForexRates] = useState({});
  const [cryptoData, setCryptoData] = useState([]);
  const [marketIndices, setMarketIndices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Base API URL - should be configured from environment variables in a real app
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  /**
   * Fetch NSE stock data with optional filters
   * @param {Object} filters - Optional filters for stock data
   * @param {string} filters.sector - Filter by sector (e.g., 'Banking', 'Manufacturing')
   * @param {string} filters.period - Time period for data (e.g., '1d', '1w', '1m', '3m', '1y')
   */
  const fetchStockData = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.sector) queryParams.append('sector', filters.sector);
      if (filters.period) queryParams.append('period', filters.period);
      
      const response = await axios.get(`${API_URL}/market/stocks?${queryParams}`);
      setStockData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch stock data');
      console.error('Stock data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /**
   * Fetch detailed information for a specific stock
   * @param {string} symbol - Stock symbol (e.g., 'SCOM', 'KCB') 
   * @param {string} period - Time period for historical data (default: '1y')
   */
  const fetchStockDetails = useCallback(async (symbol, period = '1y') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/market/stocks/${symbol}`, {
        params: { period }
      });
      return response.data;
    } catch (err) {
      setError(err.message || `Failed to fetch details for ${symbol}`);
      console.error('Stock details fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /**
   * Fetch Central Bank of Kenya rates (CBR, T-Bills, etc.)
   */
  const fetchCBKRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/market/cbk-rates`);
      setCbkRates(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch CBK rates');
      console.error('CBK rates fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /**
   * Fetch foreign exchange rates (KES against major currencies)
   */
  const fetchForexRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/market/forex-rates`);
      setForexRates(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch forex rates');
      console.error('Forex rates fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /**
   * Fetch cryptocurrency data relevant to Kenyan market
   */
  const fetchCryptoData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/market/crypto`);
      setCryptoData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch cryptocurrency data');
      console.error('Crypto data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /**
   * Fetch market indices (NSE 20, NSE 25, NASI, etc.)
   */
  const fetchMarketIndices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/market/indices`);
      setMarketIndices(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch market indices');
      console.error('Market indices fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /**
   * Get stocks with best performance over a period
   * @param {number} limit - Number of stocks to return (default: 5)
   * @param {string} period - Time period to consider (default: '1m')
   */
  const getTopPerformingStocks = useCallback((limit = 5, period = '1m') => {
    if (!stockData.length) return [];
    
    return [...stockData]
      .sort((a, b) => b.performance[period] - a.performance[period])
      .slice(0, limit);
  }, [stockData]);

  /**
   * Get stocks with worst performance over a period
   * @param {number} limit - Number of stocks to return (default: 5)
   * @param {string} period - Time period to consider (default: '1m')
   */
  const getWorstPerformingStocks = useCallback((limit = 5, period = '1m') => {
    if (!stockData.length) return [];
    
    return [...stockData]
      .sort((a, b) => a.performance[period] - b.performance[period])
      .slice(0, limit);
  }, [stockData]);

  /**
   * Calculate average market performance by sector
   */
  const getSectorPerformance = useCallback(() => {
    if (!stockData.length) return {};
    
    const sectors = {};
    
    stockData.forEach(stock => {
      if (!sectors[stock.sector]) {
        sectors[stock.sector] = {
          totalPerformance: 0,
          count: 0
        };
      }
      
      sectors[stock.sector].totalPerformance += stock.performance['1m'] || 0;
      sectors[stock.sector].count += 1;
    });
    
    // Calculate average performance for each sector
    return Object.keys(sectors).reduce((result, sector) => {
      result[sector] = sectors[sector].totalPerformance / sectors[sector].count;
      return result;
    }, {});
  }, [stockData]);

  // Load initial market data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchStockData(),
        fetchMarketIndices()
      ]);
    };
    
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    // Data states
    stockData,
    cbkRates,
    forexRates,
    cryptoData,
    marketIndices,
    
    // Loading and error states
    isLoading,
    error,
    
    // Data fetching functions
    fetchStockData,
    fetchStockDetails,
    fetchCBKRates,
    fetchForexRates,
    fetchCryptoData,
    fetchMarketIndices,
    
    // Analysis functions
    getTopPerformingStocks,
    getWorstPerformingStocks,
    getSectorPerformance
  };
};

export default useMarketData;