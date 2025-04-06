import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * StockRecommendation component displays a stock recommendation card
 * @param {Object} props - Component props
 * @param {Object} props.stock - Stock data
 * @param {Function} props.onViewDetails - Function to call when view details is clicked
 */
const StockRecommendation = ({ stock, onViewDetails }) => {
  const { t } = useTranslation();
  
  if (!stock) return null;
  
  const {
    symbol,
    name,
    price,
    change,
    changePercent,
    sector,
    recommendation,
    projectedGrowth,
    riskLevel,
    logoUrl
  } = stock;
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${(value > 0 ? '+' : '')}${value.toFixed(2)}%`;
  };
  
  // Get color based on change
  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };
  
  // Get recommendation color
  const getRecommendationColor = (rec) => {
    switch (rec?.toLowerCase()) {
      case 'buy':
      case 'strong buy':
        return 'bg-green-100 text-green-800';
      case 'hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'sell':
      case 'strong sell':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get risk level color
  const getRiskLevelColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt={name} 
                className="h-8 w-8 object-contain mr-2"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {symbol}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {name}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(price)}
            </p>
            <p className={`text-sm font-medium ${getChangeColor(change)}`}>
              {formatCurrency(change)} ({formatPercentage(changePercent)})
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('investment.sector')}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {sector}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('investment.projectedGrowth')}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {formatPercentage(projectedGrowth)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          {recommendation && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecommendationColor(recommendation)}`}>
              {recommendation}
            </span>
          )}
          
          {riskLevel && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(riskLevel)}`}>
              {riskLevel} {t('investment.risk')}
            </span>
          )}
        </div>
        
        <button
          onClick={onViewDetails}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('investment.viewDetails')}
        </button>
      </div>
    </div>
  );
};

export default StockRecommendation;
