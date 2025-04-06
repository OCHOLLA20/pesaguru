import React, { useState } from 'react';
import { useMarketData } from '../../hooks/useMarketData';
import LineChart from '../charts/LineChart';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

/**
 * MarketIndexCard - Displays a market index with current value and change
 */
const MarketIndexCard = ({ name, value, change, changePercent }) => {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeIcon = isPositive ? '↑' : '↓';

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-sm">
      <span className="text-sm text-gray-500">{name}</span>
      <span className="text-xl font-semibold mt-1">{value.toLocaleString()}</span>
      <div className={`flex items-center ${changeColor} text-sm mt-1`}>
        <span>{changeIcon}</span>
        <span className="ml-1">{formatPercentage(changePercent)}</span>
        <span className="ml-1">({formatCurrency(Math.abs(change), '', 2)})</span>
      </div>
    </div>
  );
};

/**
 * StockItem - Displays a single stock with its price and change
 */
const StockItem = ({ stock }) => {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-medium">{stock.symbol}</span>
          <span className="ml-2 text-xs text-gray-500">{stock.name}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{formatCurrency(stock.price, 'KES')}</div>
        <div className={`text-sm ${changeColor}`}>
          {isPositive ? '+' : ''}{formatPercentage(stock.changePercent)}
        </div>
      </div>
    </div>
  );
};

/**
 * CurrencyCard - Displays exchange rates
 */
const CurrencyCard = ({ rates }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium text-gray-700 mb-3">Exchange Rates</h3>
      <div className="space-y-3">
        {rates.map((rate) => (
          <div key={rate.code} className="flex justify-between">
            <span className="flex items-center">
              <span className="w-8 inline-block font-medium">{rate.code}</span>
              <span className="text-xs text-gray-500 ml-2">{rate.name}</span>
            </span>
            <span className="font-medium">
              {formatCurrency(rate.value, 'KES')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * LoadingSkeleton - Displays placeholder while data is loading
 */
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * MarketOverview - Main component displaying financial market data
 */
const MarketOverview = () => {
  const { marketData, isLoading, error, refetch } = useMarketData();
  const [timeRange, setTimeRange] = useState('1M'); // Default to 1 month view
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Market Overview</h2>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Overview</h2>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">Failed to load market data.</p>
          <button 
            onClick={refetch} 
            className="mt-2 text-sm text-red-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  const { indices, topGainers, topLosers, currencies, historicalData } = marketData;
  
  // Filter historical data based on selected time range
  const filteredData = historicalData[timeRange] || [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Market Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Market Indices */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {indices.map((index) => (
          <MarketIndexCard 
            key={index.id}
            name={index.name}
            value={index.value}
            change={index.change}
            changePercent={index.changePercent}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Index Chart */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">NSE Index Performance</h3>
            <div className="flex space-x-2 text-sm">
              {['1W', '1M', '3M', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-1 rounded ${
                    timeRange === range 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <LineChart data={filteredData} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Top Movers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Gainers */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="text-sm font-medium text-green-600 mb-2">Top Gainers</h4>
                <div className="space-y-0">
                  {topGainers.slice(0, 5).map((stock) => (
                    <StockItem key={stock.symbol} stock={stock} />
                  ))}
                </div>
              </div>
              
              {/* Top Losers */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="text-sm font-medium text-red-600 mb-2">Top Losers</h4>
                <div className="space-y-0">
                  {topLosers.slice(0, 5).map((stock) => (
                    <StockItem key={stock.symbol} stock={stock} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Currency Exchange Rates */}
          <CurrencyCard rates={currencies} />
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;