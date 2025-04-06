import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LoanComparisonTable component displays a comparison of multiple loans
 * @param {Object} props - Component props
 * @param {Array} props.loans - Array of loan data to compare
 * @param {Function} props.onSelect - Function to call when a loan is selected
 * @param {string|number} props.selectedLoanId - ID of the currently selected loan
 */
const LoanComparisonTable = ({ 
  loans = [], 
  onSelect, 
  selectedLoanId,
  className = '' 
}) => {
  const { t } = useTranslation();
  
  if (!loans || loans.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          {t('loan.noLoansToCompare')}
        </p>
      </div>
    );
  }
  
  // Find the best rate
  const bestRate = Math.min(...loans.map(loan => loan.interestRate));
  
  // Find the lowest monthly payment
  const lowestMonthlyPayment = Math.min(...loans.map(loan => loan.monthlyPayment));
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('loan.provider')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('loan.interestRate')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('loan.term')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('loan.monthlyPayment')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('loan.totalRepayment')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('loan.fees')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('loan.action')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {loans.map((loan) => (
            <tr 
              key={loan.id} 
              className={selectedLoanId === loan.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {loan.logoUrl && (
                    <img 
                      src={loan.logoUrl} 
                      alt={loan.provider} 
                      className="h-8 w-8 object-contain mr-3"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {loan.loanName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {loan.provider}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${loan.interestRate === bestRate ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                  {loan.interestRate}%
                  {loan.interestRate === bestRate && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {t('loan.bestRate')}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {loan.term} {loan.term === 1 ? t('loan.month') : t('loan.months')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${loan.monthlyPayment === lowestMonthlyPayment ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                  KES {loan.monthlyPayment.toLocaleString()}
                  {loan.monthlyPayment === lowestMonthlyPayment && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {t('loan.lowestPayment')}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  KES {loan.totalRepayment.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('loan.totalInterest')}: KES {(loan.totalRepayment - loan.amount).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {loan.fees ? `KES ${loan.fees.toLocaleString()}` : t('loan.noFees')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onSelect && onSelect(loan.id)}
                  className={`
                    py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${selectedLoanId === loan.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {selectedLoanId === loan.id ? t('loan.selected') : t('loan.select')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanComparisonTable;
