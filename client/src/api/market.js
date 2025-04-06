// src/api/market.js
import apiClient from './client';

/**
 * Get overall market summary including key indices and statistics
 * @returns {Promise} - Promise resolving to market summary data
 */
export const getMarketSummary = () => {
  return apiClient.get('/market/summary');
};

/**
 * Get current NSE indices data
 * @param {boolean} [withComponents=false] - Whether to include component stocks in response
 * @returns {Promise} - Promise resolving to NSE indices data
 */
export const getNSEIndices = (withComponents = false) => {
  return apiClient.get('/market/indices', {
    params: { withComponents }
  });
};

/**
 * Get details for a specific market index
 * @param {string} indexCode - Index code (e.g. "NSE20", "NASI", "NSE25")
 * @param {string} [period='1m'] - Historical data period (1d, 1w, 1m, 3m, 6m, 1y, 5y)
 * @returns {Promise} - Promise resolving to specific index details and historical data
 */
export const getIndexDetails = (indexCode, period = '1m') => {
  return apiClient.get(`/market/indices/${indexCode}`, {
    params: { period }
  });
};

/**
 * Get current foreign exchange rates
 * @param {string} [base='KES'] - Base currency code
 * @param {Array} [symbols] - Array of currency symbols to include (e.g. ["USD", "EUR", "GBP"])
 * @returns {Promise} - Promise resolving to forex rates data
 */
export const getForexRates = (base = 'KES', symbols = []) => {
  return apiClient.get('/market/forex', {
    params: {
      base,
      symbols: symbols.length > 0 ? symbols.join(',') : undefined
    }
  });
};

/**
 * Get historical forex rates
 * @param {string} [base='KES'] - Base currency code
 * @param {string} symbol - Target currency symbol
 * @param {string} [period='1m'] - Historical data period (1d, 1w, 1m, 3m, 6m, 1y)
 * @returns {Promise} - Promise resolving to historical forex data
 */
export const getHistoricalForexRates = (base = 'KES', symbol, period = '1m') => {
  return apiClient.get('/market/forex/historical', {
    params: { base, symbol, period }
  });
};

/**
 * Get cryptocurrency market data
 * @param {Array} [symbols] - Array of crypto symbols (e.g. ["BTC", "ETH", "XRP"])
 * @param {string} [currency='KES'] - Price currency
 * @returns {Promise} - Promise resolving to cryptocurrency market data
 */
export const getCryptoData = (symbols = [], currency = 'KES') => {
  return apiClient.get('/market/crypto', {
    params: {
      symbols: symbols.length > 0 ? symbols.join(',') : undefined,
      currency
    }
  });
};

/**
 * Get historical cryptocurrency data
 * @param {string} symbol - Crypto symbol (e.g. "BTC")
 * @param {string} [currency='KES'] - Price currency
 * @param {string} [period='1m'] - Historical data period (1d, 1w, 1m, 3m, 6m, 1y)
 * @returns {Promise} - Promise resolving to historical crypto data
 */
export const getHistoricalCryptoData = (symbol, currency = 'KES', period = '1m') => {
  return apiClient.get('/market/crypto/historical', {
    params: { symbol, currency, period }
  });
};

/**
 * Get market news and announcements
 * @param {number} [limit=10] - Number of news items to retrieve
 * @param {string} [category] - Optional category filter (e.g. "stocks", "economy", "companies")
 * @returns {Promise} - Promise resolving to market news items
 */
export const getMarketNews = (limit = 10, category) => {
  return apiClient.get('/market/news', {
    params: {
      limit,
      category
    }
  });
};

/**
 * Get Central Bank of Kenya (CBK) rates and statistics
 * @returns {Promise} - Promise resolving to CBK rates and statistics
 */
export const getCBKRates = () => {
  return apiClient.get('/market/cbk-rates');
};

/**
 * Get historical CBK rates
 * @param {string} rateType - Type of rate (e.g. "cbr", "tbill", "repo")
 * @param {string} [period='1y'] - Historical data period (1m, 3m, 6m, 1y, 5y)
 * @returns {Promise} - Promise resolving to historical CBK rate data
 */
export const getHistoricalCBKRates = (rateType, period = '1y') => {
  return apiClient.get('/market/cbk-rates/historical', {
    params: { type: rateType, period }
  });
};

/**
 * Get market movers (top gainers and losers)
 * @param {string} [exchange='NSE'] - Exchange code
 * @param {number} [limit=5] - Number of items to retrieve
 * @returns {Promise} - Promise resolving to market movers data
 */
export const getMarketMovers = (exchange = 'NSE', limit = 5) => {
  return apiClient.get('/market/movers', {
    params: { exchange, limit }
  });
};

/**
 * Get market calendar events (upcoming IPOs, dividend dates, etc.)
 * @param {string} [from] - Start date (YYYY-MM-DD)
 * @param {string} [to] - End date (YYYY-MM-DD)
 * @param {string} [type] - Event type filter (e.g. "ipo", "dividend", "earnings")
 * @returns {Promise} - Promise resolving to market calendar events
 */
export const getMarketCalendar = (from, to, type) => {
  return apiClient.get('/market/calendar', {
    params: { 
      from, 
      to,
      type
    }
  });
};

/**
 * Get market sentiment analysis
 * @returns {Promise} - Promise resolving to market sentiment data
 */
export const getMarketSentiment = () => {
  return apiClient.get('/market/sentiment');
};

/**
 * Get market sector performance
 * @param {string} [period='1m'] - Period for analysis (1d, 1w, 1m, 3m, 6m, 1y)
 * @returns {Promise} - Promise resolving to sector performance data
 */
export const getSectorPerformance = (period = '1m') => {
  return apiClient.get('/market/sectors', {
    params: { period }
  });
};

export default {
  getMarketSummary,
  getNSEIndices,
  getIndexDetails,
  getForexRates,
  getHistoricalForexRates,
  getCryptoData,
  getHistoricalCryptoData,
  getMarketNews,
  getCBKRates,
  getHistoricalCBKRates,
  getMarketMovers,
  getMarketCalendar,
  getMarketSentiment,
  getSectorPerformance
};