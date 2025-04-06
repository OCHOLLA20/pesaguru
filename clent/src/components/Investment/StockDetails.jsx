import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getStockDetails } from '../../api/investment';

const StockDetails = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('1m'); // Default period is 1 month
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Fetch stock details when component mounts or period changes
  useEffect(() => {
    const fetchStockDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStockDetails(symbol, period);
        setStockData(data);
      } catch (err) {
        console.error('Error fetching stock details:', err);
        setError('Failed to load stock details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchStockDetails();
    }
  }, [symbol, period]);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Format large numbers (e.g., for market cap)
  const formatLargeNumber = (num) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(2)}K`;
    }
    return num.toString();
  };

  // Format date for chart tooltip
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load stock details
          </h3>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If data not yet loaded
  if (!stockData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Stock Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center">
            {stockData.logoUrl && (
              <img
                src={stockData.logoUrl}
                alt={`${stockData.companyName} logo`}
                className="h-10 w-10 mr-3 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{stockData.symbol}</h1>
              <p className="text-gray-600">{stockData.companyName}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(stockData.currentPrice)}
          </div>
          <div className={`flex items-center ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{formatCurrency(stockData.change)}</span>
            <span className="ml-2">({formatPercentage(stockData.changePercent)})</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {stockData.change >= 0 ? (
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </div>
          <div className="text-sm text-gray-500">
            {stockData.updatedAt ? `Updated: ${formatDate(stockData.updatedAt)}` : 'As of market close'}
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="mb-6">
        <div className="flex justify-center md:justify-start space-x-2 overflow-x-auto pb-2">
          {['1d', '1w', '1m', '3m', '6m', '1y', '5y'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setPeriod(timeframe)}
              className={`px-3 py-1 text-sm rounded-md focus:outline-none ${
                period === timeframe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {timeframe.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Price Chart */}
      <div className="mb-8">
        <div className="h-64 md:h-80">
          {stockData.historicalPrices && stockData.historicalPrices.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stockData.historicalPrices}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    if (period === '1d') return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
                    if (period === '1w' || period === '1m') return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
                    return date.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => formatCurrency(value).replace('KES', '')}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Price']}
                  labelFormatter={(timestamp) => formatDate(timestamp)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={stockData.change >= 0 ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No historical price data available for this period.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stock Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Key Statistics */}
        <div className="bg-gray-50 rounded-lg p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Key Statistics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Open</span>
              <span className="font-medium text-gray-900">{formatCurrency(stockData.openPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Previous Close</span>
              <span className="font-medium text-gray-900">{formatCurrency(stockData.previousClose)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Day Range</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(stockData.dayLow)} - {formatCurrency(stockData.dayHigh)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">52 Week Range</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(stockData.yearLow)} - {formatCurrency(stockData.yearHigh)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volume</span>
              <span className="font-medium text-gray-900">{stockData.volume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Volume</span>
              <span className="font-medium text-gray-900">{stockData.avgVolume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Market Cap</span>
              <span className="font-medium text-gray-900">{formatCurrency(stockData.marketCap)} ({formatLargeNumber(stockData.marketCap)})</span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-gray-50 rounded-lg p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sector</span>
              <span className="font-medium text-gray-900">{stockData.sector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Industry</span>
              <span className="font-medium text-gray-900">{stockData.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">P/E Ratio</span>
              <span className="font-medium text-gray-900">
                {stockData.peRatio ? stockData.peRatio.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">EPS</span>
              <span className="font-medium text-gray-900">
                {stockData.eps ? formatCurrency(stockData.eps) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dividend Yield</span>
              <span className="font-medium text-gray-900">
                {stockData.dividendYield ? `${(stockData.dividendYield * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Beta</span>
              <span className="font-medium text-gray-900">
                {stockData.beta ? stockData.beta.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shares Outstanding</span>
              <span className="font-medium text-gray-900">
                {stockData.sharesOutstanding ? `${formatLargeNumber(stockData.sharesOutstanding)}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Description */}
      {stockData.description && (
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">About {stockData.companyName}</h2>
          <div className="text-gray-700 text-sm leading-relaxed space-y-2">
            <p>{stockData.description}</p>
          </div>
        </div>
      )}

      {/* Analyst Recommendations */}
      {stockData.analystRecommendations && (
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Analyst Recommendations</h2>
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-700">Consensus Rating</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                stockData.analystRating === 'Buy' || stockData.analystRating === 'Strong Buy' 
                  ? 'bg-green-100 text-green-800'
                  : stockData.analystRating === 'Hold'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {stockData.analystRating}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-700">Target Price</div>
              <div className="font-medium text-gray-900">
                {formatCurrency(stockData.targetPrice)}
                <span className="ml-2 text-sm text-gray-500">
                  ({stockData.targetPrice > stockData.currentPrice ? '+' : ''}
                  {(((stockData.targetPrice / stockData.currentPrice) - 1) * 100).toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <div className="h-10 flex rounded-lg overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${stockData.buyPercentage}%` }}></div>
              <div className="bg-yellow-500 h-full" style={{ width: `${stockData.holdPercentage}%` }}></div>
              <div className="bg-red-500 h-full" style={{ width: `${stockData.sellPercentage}%` }}></div>
            </div>
            
            <div className="flex justify-between text-xs mt-1 text-gray-600">
              <div>Buy ({stockData.buyPercentage}%)</div>
              <div>Hold ({stockData.holdPercentage}%)</div>
              <div>Sell ({stockData.sellPercentage}%)</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setShowBuyModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Buy Stock
        </button>
        <button
          onClick={() => window.open(`https://www.nse.co.ke/company-profile/${symbol.toLowerCase()}/`, '_blank')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          View on NSE
        </button>
        <button
          onClick={() => window.open(`https://www.bloomberg.com/quote/${symbol}:KN`, '_blank')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          More Research
        </button>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Buy {stockData.symbol}</h2>
              <button 
                onClick={() => setShowBuyModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Current Price: {formatCurrency(stockData.currentPrice)}</p>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Shares
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Type
                </label>
                <select
                  id="orderType"
                  name="orderType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="market">Market Order</option>
                  <option value="limit">Limit Order</option>
                  <option value="stop">Stop Order</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBuyModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('This is a demo feature. In a real application, this would connect to a brokerage API to place an order.');
                  setShowBuyModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;