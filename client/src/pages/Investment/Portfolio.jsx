import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInvestments } from '../../hooks/useInvestments';
import { usePortfolioTransactions } from '../../hooks/usePortfolioTransactions';
import PortfolioAllocation from '../../components/Investment/PortfolioAllocation';
import PerformanceChart from '../../components/charts/PerformanceChart';
import AssetTable from '../../components/Investment/AssetTable';
import TransactionHistory from '../../components/Investment/TransactionHistory';
import RebalanceModal from '../../components/Investment/RebalanceModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { LineChart, BarChart } from 'recharts';

const Portfolio = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('1m'); // Options: 1w, 1m, 3m, 6m, 1y, all
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeTab, setActiveTab] = useState('holdings'); // Options: holdings, performance, transactions
  
  // Fetch portfolio data
  const { portfolio, isLoading: portfolioLoading, error: portfolioError, fetchPortfolio } = useInvestments();
  const { transactions, isLoading: transactionsLoading, error: transactionsError } = usePortfolioTransactions();
  
  const isLoading = portfolioLoading || transactionsLoading;
  const error = portfolioError || transactionsError;

  useEffect(() => {
    // Refresh portfolio data when component mounts
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleRebalance = async (newAllocation) => {
    try {
      // API call would go here
      await fetchPortfolio(); // Refresh after rebalance
      setShowRebalanceModal(false);
    } catch (err) {
      console.error('Failed to rebalance portfolio:', err);
    }
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
  };

  if (isLoading) {
    return <LoadingSpinner label={t('portfolio.loading')} />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // Calculate performance metrics
  const calculateMetrics = () => {
    if (!portfolio) return { totalReturn: 0, annualizedReturn: 0, volatility: 0 };
    
    return {
      totalReturn: ((portfolio.current_value - portfolio.initial_investment) / portfolio.initial_investment) * 100,
      annualizedReturn: portfolio.annualized_return || 8.2, // Example fallback value
      volatility: portfolio.volatility || 12.5 // Example fallback value
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-gray-800">{t('portfolio.title')}</h1>
        <div className="mt-2 md:mt-0 flex space-x-2">
          <button 
            onClick={() => setShowRebalanceModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {t('portfolio.rebalance')}
          </button>
          <button 
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            {t('portfolio.export')}
          </button>
        </div>
      </div>

      {/* Portfolio Value Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">{t('portfolio.totalValue')}</h2>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-KE', {
                style: 'currency',
                currency: 'KES'
              }).format(portfolio?.total_value || 0)}
            </p>
            <div className={`flex items-center ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-sm font-medium">
                {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
              </span>
              <svg 
                className="h-4 w-4 ml-1" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d={metrics.totalReturn >= 0 
                    ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" 
                    : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"} 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">{t('portfolio.annualizedReturn')}</h2>
            <p className="text-2xl font-bold text-gray-900">{metrics.annualizedReturn.toFixed(2)}%</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">{t('portfolio.volatility')}</h2>
            <p className="text-2xl font-bold text-gray-900">{metrics.volatility.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-2">
          {['1w', '1m', '3m', '6m', '1y', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === range 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t(`portfolio.timeRanges.${range}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">{t('portfolio.performanceChart')}</h2>
        <div className="h-80">
          <PerformanceChart timeRange={timeRange} portfolioData={portfolio?.performance_data || []} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('holdings')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'holdings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('portfolio.holdings')}
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'performance'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('portfolio.performance')}
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'transactions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('portfolio.transactions')}
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'holdings' && (
            <>
              <h3 className="text-lg font-semibold mb-4">{t('portfolio.assetAllocation')}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                <div className="lg:col-span-5">
                  <PortfolioAllocation allocation={portfolio?.allocation || []} />
                </div>
                <div className="lg:col-span-7">
                  <div className="space-y-4">
                    {portfolio?.allocation?.map((category) => (
                      <div key={category.category} className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{t(`investments.categories.${category.category}`)}</span>
                            <span className="text-sm font-medium">{category.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="h-1.5 rounded-full" 
                              style={{ 
                                width: `${category.percentage}%`,
                                backgroundColor: category.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">{t('portfolio.yourAssets')}</h3>
              <AssetTable 
                assets={portfolio?.assets || []} 
                onAssetSelect={handleAssetSelect} 
              />
            </>
          )}
          
          {activeTab === 'performance' && (
            <>
              <h3 className="text-lg font-semibold mb-4">{t('portfolio.sectorPerformance')}</h3>
              <div className="h-64 mb-8">
                <BarChart 
                  data={portfolio?.sector_performance || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                />
              </div>
              
              <h3 className="text-lg font-semibold mb-4">{t('portfolio.monthlyReturns')}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('portfolio.month')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('portfolio.return')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('portfolio.benchmark')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('portfolio.difference')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(portfolio?.monthly_returns || []).map((month) => (
                      <tr key={month.date}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month.date}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          month.return >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {month.return >= 0 ? '+' : ''}{month.return.toFixed(2)}%
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          month.benchmark >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {month.benchmark >= 0 ? '+' : ''}{month.benchmark.toFixed(2)}%
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          month.return - month.benchmark >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {month.return - month.benchmark >= 0 ? '+' : ''}
                          {(month.return - month.benchmark).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {activeTab === 'transactions' && (
            <>
              <h3 className="text-lg font-semibold mb-4">{t('portfolio.transactionHistory')}</h3>
              <TransactionHistory transactions={transactions || []} />
            </>
          )}
        </div>
      </div>

      {/* Rebalance Modal */}
      {showRebalanceModal && (
        <RebalanceModal 
          isOpen={showRebalanceModal}
          onClose={() => setShowRebalanceModal(false)}
          currentAllocation={portfolio?.allocation || []}
          onRebalance={handleRebalance}
        />
      )}
    </div>
  );
};

export default Portfolio;