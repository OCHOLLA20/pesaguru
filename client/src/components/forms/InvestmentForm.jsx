import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { validateInvestmentForm } from '../../utils/validators';

/**
 * InvestmentForm component for creating or updating investment information
 */
const InvestmentForm = ({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false,
  submitButtonText,
  cancelButtonText,
  onCancel
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    investmentAmount: '',
    riskLevel: 'moderate',
    investmentHorizon: 'medium',
    investmentGoal: '',
    ...initialData
  });
  
  const [errors, setErrors] = useState({});
  
  // Update form when initialData changes
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateInvestmentForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Call onSubmit with form data
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('investment.form.amount')} (KES)
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="investmentAmount"
            name="investmentAmount"
            value={formData.investmentAmount}
            onChange={handleChange}
            className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
              errors.investmentAmount ? 'border-red-300' : ''
            }`}
            placeholder="e.g., 10000"
          />
          {errors.investmentAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.investmentAmount}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('investment.form.riskLevel')}
        </label>
        <div className="mt-1">
          <select
            id="riskLevel"
            name="riskLevel"
            value={formData.riskLevel}
            onChange={handleChange}
            className="block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="conservative">{t('investment.riskLevels.conservative')}</option>
            <option value="moderate">{t('investment.riskLevels.moderate')}</option>
            <option value="aggressive">{t('investment.riskLevels.aggressive')}</option>
          </select>
          {errors.riskLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.riskLevel}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.riskLevel === 'conservative' && t('investment.riskDescriptions.conservative')}
          {formData.riskLevel === 'moderate' && t('investment.riskDescriptions.moderate')}
          {formData.riskLevel === 'aggressive' && t('investment.riskDescriptions.aggressive')}
        </p>
      </div>
      
      <div>
        <label htmlFor="investmentHorizon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('investment.form.timeHorizon')}
        </label>
        <div className="mt-1">
          <select
            id="investmentHorizon"
            name="investmentHorizon"
            value={formData.investmentHorizon}
            onChange={handleChange}
            className="block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="short">{t('investment.timeHorizons.short')}</option>
            <option value="medium">{t('investment.timeHorizons.medium')}</option>
            <option value="long">{t('investment.timeHorizons.long')}</option>
          </select>
          {errors.investmentHorizon && (
            <p className="mt-1 text-sm text-red-600">{errors.investmentHorizon}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.investmentHorizon === 'short' && t('investment.horizonDescriptions.short')}
          {formData.investmentHorizon === 'medium' && t('investment.horizonDescriptions.medium')}
          {formData.investmentHorizon === 'long' && t('investment.horizonDescriptions.long')}
        </p>
      </div>
      
      <div>
        <label htmlFor="investmentGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('investment.form.goal')}
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="investmentGoal"
            name="investmentGoal"
            value={formData.investmentGoal}
            onChange={handleChange}
            className="block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder={t('investment.form.goalPlaceholder')}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cancelButtonText || t('common.cancel')}
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? t('common.submitting') : (submitButtonText || t('common.submit'))}
        </button>
      </div>
    </form>
  );
};

export default InvestmentForm;
