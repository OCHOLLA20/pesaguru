import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LoanCard component displays information about a loan
 * @param {Object} props - Component props
 * @param {Object} props.loan - Loan data
 * @param {Function} props.onSelect - Function to call when loan is selected
 * @param {boolean} props.isSelected - Whether this loan is selected
 */
const LoanCard = ({ loan, onSelect, isSelected = false, className = '' }) => {
  const { t } = useTranslation();
  
  if (!loan) return null;
  
  const {
    id,
    loanName,
    provider,
    interestRate,
    term,
    amount,
    monthlyPayment,
    totalRepayment,
    requirements = [],
    logoUrl
  } = loan;
  
  return (
    <div 
      className={`
        border rounded-lg overflow-hidden transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
        }
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt={provider} 
                className="h-10 w-10 object-contain mr-3"
              />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {loanName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {provider}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {interestRate}%
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('loan.interestRate')}
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('loan.amount')}
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              KES {amount.toLocaleString()}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('loan.term')}
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {term} {term === 1 ? t('loan.month') : t('loan.months')}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('loan.monthlyPayment')}
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              KES {monthlyPayment.toLocaleString()}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('loan.totalRepayment')}
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              KES {totalRepayment.toLocaleString()}
            </p>
          </div>
        </div>
        
        {requirements.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('loan.requirements')}:
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={() => onSelect && onSelect(id)}
            className={`
              w-full py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            {isSelected ? t('loan.selected') : t('loan.select')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
