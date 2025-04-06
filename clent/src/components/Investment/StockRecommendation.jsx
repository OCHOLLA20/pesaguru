import React, { useState, useEffect } from 'react';
import { useStockRecommendations } from '../../hooks/useStockRecommendations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, Filter, Loader } from 'lucide-react';

const StockRecommendation = () => {
  const [filters, setFilters] = useState({
    riskLevel: 'moderate',
    investmentHorizon: 'medium',
    sectors: []
  });

  const { recommendations, isLoading, error, fetchRecommendations } = useStockRecommendations(filters);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAddToWatchlist = (stockId) => {
    // Implementation would connect to your watchlist API
    console.log(`Added stock ${stockId} to watchlist`);
    // Show success toast or notification here
  };

  // Filter panel component
  const FilterPanel = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Refine Recommendations</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
          <select 
            value={filters.riskLevel}
            onChange={(e) => handleFilterChange({ riskLevel: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Horizon</label>
          <select 
            value={filters.investmentHorizon}
            onChange={(e) => handleFilterChange({ investmentHorizon: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="short">Short-term (0-2 years)</option>
            <option value="medium">Medium-term (2-5 years)</option>
            <option value="long">Long-term (5+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sectors</label>
          <div className="flex flex-wrap gap-2">
            {['Banking', 'Telecom', 'Manufacturing', 'Energy', 'Insurance'].map((sector) => (
              <button
                key={sector}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.sectors.includes(sector) 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
                onClick={() => {
                  const newSectors = filters.sectors.includes(sector)
                    ? filters.sectors.filter(s => s !== sector)
                    : [...filters.sectors, sector];
                  handleFilterChange({ sectors: newSectors });
                }}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => fetchRecommendations()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Stock card component
  const StockCard = ({ stock }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{stock.symbol}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            stock.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {stock.trend === 'up' ? '+' : '-'}{stock.changePercentage}%
          </span>
        </div>
        <p className="text-sm text-gray-500">{stock.name}</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Current Price</span>
          <span className="text-sm font-medium">KES {stock.currentPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Sector</span>
          <span className="text-sm font-medium">{stock.sector}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-sm text-gray-500">Recommended Amount</span>
          <span className="text-sm font-medium">KES {stock.recommendedAmount.toLocaleString()}</span>
        </div>
        
        <div className="h-20 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stock.historicalPrices}>
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={stock.trend === 'up' ? '#10B981' : '#EF4444'} 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => handleAddToWatchlist(stock.id)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            Add to Watchlist
          </button>
          <button 
            className="flex-1 bg-white text-blue-600 py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  // Loading skeleton
  const StockCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        
        <div className="h-20 mb-4 bg-gray-200 rounded"></div>
        
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ message, icon, actionLabel, onAction }) => (
    <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-4">
        {icon || <AlertCircle className="w-12 h-12 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            Investment Recommendations
          </h2>
          
          <div className="flex items-center">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center space-x-1 bg-white px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {showFilterPanel && <FilterPanel />}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <StockCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </p>
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Market Performance (Last 30 Days)</h3>
            <div className="h-64 bg-white p-4 rounded-lg shadow-md">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={Array(30).fill().map((_, i) => ({
                    day: i + 1,
                    NSE20: 1800 + Math.random() * 200,
                    NASI: 100 + Math.random() * 20
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="NSE20" stroke="#3B82F6" name="NSE 20" />
                  <Line type="monotone" dataKey="NASI" stroke="#10B981" name="NASI" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(stock => (
              <StockCard key={stock.id} stock={stock} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          message="Try adjusting your filters to see more recommendations"
          icon={<Filter className="w-12 h-12 text-gray-400" />}
          actionLabel="Reset Filters"
          onAction={() => {
            setFilters({
              riskLevel: 'moderate',
              investmentHorizon: 'medium',
              sectors: []
            });
            fetchRecommendations();
          }}
        />
      )}
    </div>
  );
};

export default StockRecommendation;