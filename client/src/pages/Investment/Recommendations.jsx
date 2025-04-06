import React, { useState, useEffect } from 'react';
import { useInvestments } from '../../hooks/useInvestments';
import { useUserProfile } from '../../hooks/useUserProfile';
import StockRecommendationCard from '../../components/Investment/StockRecommendation';
import FilterPanel from '../../components/Investment/FilterPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import { LineChart, BarChart } from '../../components/charts';

const Recommendations = () => {
  // State for filters
  const [filters, setFilters] = useState({
    riskLevel: 'moderate',
    investmentHorizon: 'medium',
    sectors: [],
    minAmount: 5000,
    maxAmount: 1000000
  });

  // Get user profile for personalization
  const { userProfile, isLoading: profileLoading } = useUserProfile();
  
  // Custom hook for investment data
  const { 
    recommendations, 
    fetchRecommendations, 
    isLoading, 
    error 
  } = useInvestments();

  // Fetch recommendations when component mounts or filters change
  useEffect(() => {
    const getRecommendations = async () => {
      try {
        // Use user profile risk level if available, otherwise use filter default
        const riskLevel = userProfile?.risk_profile || filters.riskLevel;
        
        await fetchRecommendations({
          risk_level: riskLevel,
          investment_horizon: filters.investmentHorizon,
          sectors: filters.sectors.length > 0 ? filters.sectors : undefined,
          min_amount: filters.minAmount,
          max_amount: filters.maxAmount
        });
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };

    if (!profileLoading) {
      getRecommendations();
    }
  }, [fetchRecommendations, filters, userProfile, profileLoading]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate market performance for charts
  const getMarketPerformance = () => {
    if (!recommendations || recommendations.length === 0) return [];
    
    // Extract historical prices data for chart
    return recommendations
      .filter(stock => stock.historicalPrices?.length > 0)
      .slice(0, 5) // Top 5 stocks for chart clarity
      .map(stock => ({
        name: stock.symbol,
        data: stock.historicalPrices.map(price => ({
          date: price.date,
          value: price.close
        }))
      }));
  };

  // Calculate sector allocation for charts
  const getSectorAllocation = () => {
    if (!recommendations || recommendations.length === 0) return [];
    
    const sectorMap = {};
    recommendations.forEach(stock => {
      if (stock.sector) {
        sectorMap[stock.sector] = (sectorMap[stock.sector] || 0) + 1;
      }
    });
    
    return Object.entries(sectorMap).map(([sector, count]) => ({
      name: sector,
      value: (count / recommendations.length) * 100
    }));
  };

  // Loading state
  if (isLoading || profileLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment Recommendations</h1>
        <LoadingSpinner label="Preparing your personalized investment recommendations..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment Recommendations</h1>
        <ErrorAlert 
          message="Failed to load investment recommendations. Please try again later." 
          retryAction={() => fetchRecommendations(filters)} 
        />
      </div>
    );
  }

  // Empty state
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment Recommendations</h1>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-grow">
            <p className="text-gray-600">Customize your recommendations:</p>
          </div>
          <FilterPanel filters={filters} onChange={handleFilterChange} />
        </div>
        <EmptyState 
          title="No recommendations match your criteria" 
          description="Try adjusting your filters or risk profile to see more investment options."
          icon={<AdjustIcon className="w-12 h-12 text-gray-400" />}
          actionLabel="Reset filters"
          onAction={() => setFilters({
            riskLevel: 'moderate',
            investmentHorizon: 'medium',
            sectors: [],
            minAmount: 5000,
            maxAmount: 1000000
          })}
        />
      </div>
    );
  }

  // Main content with recommendations
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Investment Recommendations</h1>
      
      {/* Filters and header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-600">
            Personalized recommendations based on your {userProfile?.risk_profile || 'moderate'} risk profile
          </p>
        </div>
        <FilterPanel filters={filters} onChange={handleFilterChange} />
      </div>
      
      {/* Market Performance Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Performance (Last 30 Days)</h2>
        <div className="h-64">
          <LineChart 
            data={getMarketPerformance()} 
            xAxisKey="date" 
            yAxisKey="value"
            colors={['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE']}
          />
        </div>
      </div>
      
      {/* Sector Allocation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Sector Allocation</h2>
        <div className="h-64">
          <BarChart 
            data={getSectorAllocation()} 
            xAxisKey="name" 
            yAxisKey="value" 
            colors={['#1E40AF']}
          />
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Investments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(stock => (
            <StockRecommendationCard 
              key={stock.symbol} 
              stock={stock}
              onAddToWatchlist={() => handleAddToWatchlist(stock.id)}
              onViewDetails={() => navigateToDetails(stock.symbol)}
            />
          ))}
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Disclaimer:</strong> The recommendations provided are based on historical data and 
          your risk profile. Past performance is not indicative of future results. Always conduct your 
          own research or consult with a financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

// For the Empty state icon
const AdjustIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
    />
  </svg>
);

// The functions below would be implemented in the actual component
const handleAddToWatchlist = (stockId) => {
  // Implementation for adding stock to watchlist
  console.log(`Adding stock ${stockId} to watchlist`);
};

const navigateToDetails = (symbol) => {
  // Implementation for navigating to stock details page
  console.log(`Navigating to details for ${symbol}`);
};

export default Recommendations;