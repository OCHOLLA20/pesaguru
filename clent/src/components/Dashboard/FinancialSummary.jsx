import React from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { formatCurrency } from '../../utils/formatters';
import DonutChart from '../charts/DonutChart';

/**
 * SummaryCard - Displays a financial metric with title, value and trend indicator
 */
const SummaryCard = ({ title, value, trend, invertTrend = false }) => {
  // Determine if trend should be shown as positive (green) or negative (red)
  const isPositive = invertTrend ? trend === 'down' : trend === 'up';
  const trendIcon = isPositive ? '↑' : '↓';
  const trendClass = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex items-center mt-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {trend && (
          <span className={`ml-2 ${trendClass} text-sm font-medium`}>
            {trendIcon}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * LoadingState - Skeleton loader for financial summary
 */
const SummaryCardSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
  </div>
);

/**
 * ErrorState - Displays error message when data loading fails
 */
const ErrorState = ({ message }) => (
  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
    <p className="text-red-600">{message}</p>
    <button className="mt-2 text-sm text-red-600 underline">Retry</button>
  </div>
);

/**
 * FinancialSummary - Main component displaying user's financial overview
 */
const FinancialSummary = () => {
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfile();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Could not load your financial summary" />;
  }

  // Calculate net worth from assets and liabilities
  const { totalAssets, totalLiabilities, investmentAllocation } = userProfile;
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Total Assets"
          value={formatCurrency(totalAssets, 'KES')}
          trend={totalAssets > userProfile.previousTotalAssets ? 'up' : 'down'}
        />
        <SummaryCard
          title="Total Liabilities"
          value={formatCurrency(totalLiabilities, 'KES')}
          trend={totalLiabilities < userProfile.previousTotalLiabilities ? 'up' : 'down'}
          invertTrend // For liabilities, down is good
        />
        <SummaryCard
          title="Net Worth"
          value={formatCurrency(netWorth, 'KES')}
          trend={netWorth > (userProfile.previousTotalAssets - userProfile.previousTotalLiabilities) ? 'up' : 'down'}
        />
      </div>

      {investmentAllocation && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Investment Allocation</h3>
          <div className="h-64">
            <DonutChart
              data={investmentAllocation.map(item => ({
                name: item.category,
                value: item.percentage,
                color: item.color
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;