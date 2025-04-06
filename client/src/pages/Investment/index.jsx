import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInvestments from '../../hooks/useInvestments';
import useUserProfile from '../../hooks/useUserProfile';
import PortfolioAllocation from '../../components/Investment/PortfolioAllocation';
import StockRecommendation from '../../components/Investment/StockRecommendation';
import InvestmentForm from '../../components/forms/InvestmentForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useTranslation } from 'react-i18next';

const InvestmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  
  // Fetch investment data and user profile
  const { recommendations, portfolio, isLoading: investmentsLoading, error: investmentsError, fetchRecommendations } = useInvestments();
  const { userProfile, isLoading: profileLoading, error: profileError } = useUserProfile();
  
  const isLoading = investmentsLoading || profileLoading;
  const error = investmentsError || profileError;
  
  // Handle form submission for getting personalized recommendations
  const handleInvestmentFormSubmit = async (formData) => {
    await fetchRecommendations(formData);
    setShowInvestmentForm(false);
  };

  // Navigate to stock details page
  const handleViewStockDetails = (symbol) => {
    navigate(`/investments/stocks/${symbol}`);
  };

  if (isLoading) {
    return <LoadingSpinner label={t('investments.loading')} />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-gray-800">{t('investments.title')}</h1>
        <div className="mt-2 md:mt-0">
          <button 
            onClick={() => setShowInvestmentForm(!showInvestmentForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {showInvestmentForm ? t('common.cancel') : t('investments.getRecommendations')}
          </button>
        </div>
      </div>

      {showInvestmentForm ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('investments.customizeRecommendations')}</h2>
          <InvestmentForm 
            onSubmit={handleInvestmentFormSubmit} 
            initialValues={{
              investment_amount: '',
              risk_level: userProfile?.risk_profile || 'moderate',
              investment_horizon: 'medium'
            }}
          />
        </div>
      ) : (
        <>
          {/* Portfolio Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('investments.portfolioOverview')}</h2>
            
            {portfolio && portfolio.total_value > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Portfolio Summary */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="border border-gray-200 rounded-md p-4">
                    <p className="text-sm text-gray-500">{t('investments.totalValue')}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES'
                      }).format(portfolio.total_value)}
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-4">
                    <p className="text-sm text-gray-500">{t('investments.cashBalance')}</p>
                    <p className="text-xl font-semibold text-gray-800">
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES'
                      }).format(portfolio.cash_balance)}
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-4">
                    <p className="text-sm text-gray-500">{t('investments.riskScore')}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(portfolio.risk_score / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {portfolio.risk_score.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Portfolio Allocation Chart */}
                <div className="lg:col-span-8">
                  <PortfolioAllocation allocation={portfolio.allocation} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('investments.noPortfolio')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('investments.startInvesting')}</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInvestmentForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('investments.getStarted')}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Investment Recommendations Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('investments.recommendations')}</h2>
            
            {recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((stock) => (
                  <StockRecommendation 
                    key={stock.symbol} 
                    stock={stock} 
                    onViewDetails={() => handleViewStockDetails(stock.symbol)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('investments.noRecommendations')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('investments.customizeToSee')}</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInvestmentForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('investments.customize')}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Market Trends Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('investments.marketTrends')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-500">{t('investments.nseIndex')}</p>
                <p className="text-xl font-semibold text-gray-800">3,254.76</p>
                <p className="text-sm font-medium text-green-600">+1.2%</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-500">{t('investments.topSector')}</p>
                <p className="text-xl font-semibold text-gray-800">{t('investments.banking')}</p>
                <p className="text-sm font-medium text-green-600">+2.5%</p>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-500">{t('investments.marketMood')}</p>
                <p className="text-xl font-semibold text-gray-800">{t('investments.bullish')}</p>
                <p className="text-sm font-medium text-gray-600">{t('investments.moderate')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvestmentPage;