import React, { useState, useEffect } from 'react';
import { useInvestments } from '../../hooks/useInvestments';
import { useUserProfile } from '../../hooks/useUserProfile';

const InvestmentForm = ({ onSubmit, initialValues = {} }) => {
  const { fetchRecommendations, isLoading: isLoadingRecommendations } = useInvestments();
  const { userProfile, isLoading: isLoadingProfile } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [sliderValue, setSliderValue] = useState(50000);

  const [formData, setFormData] = useState({
    investment_amount: initialValues.investment_amount || 50000,
    risk_level: initialValues.risk_level || 'moderate',
    investment_horizon: initialValues.investment_horizon || 'medium',
    goal_id: initialValues.goal_id || ''
  });

  // Financial goals from user profile or default options
  const financialGoals = userProfile?.financialGoals || [
    { id: 'retirement', name: 'Retirement Planning' },
    { id: 'education', name: 'Education Fund' },
    { id: 'house', name: 'Home Purchase' },
    { id: 'emergency', name: 'Emergency Fund' },
    { id: 'business', name: 'Business Investment' }
  ];

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any previous error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle slider change (for investment amount)
  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    setFormData(prev => ({
      ...prev,
      investment_amount: value
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.investment_amount || formData.investment_amount < 1000) {
      newErrors.investment_amount = 'Investment amount must be at least KES 1,000';
    }
    
    if (!formData.risk_level) {
      newErrors.risk_level = 'Please select a risk level';
    }
    
    if (!formData.investment_horizon) {
      newErrors.investment_horizon = 'Please select an investment time horizon';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert amount to number
      const processedData = {
        ...formData,
        investment_amount: parseFloat(formData.investment_amount)
      };
      
      // Get investment recommendations
      const recommendationsData = await fetchRecommendations(processedData);
      setRecommendations(recommendationsData);
      setShowResults(true);
      
      // Call parent's onSubmit if provided
      if (onSubmit) {
        onSubmit(processedData);
      }
    } catch (err) {
      console.error('Error getting investment recommendations:', err);
      setErrors({
        form: 'Failed to generate investment recommendations. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setFormData({
      investment_amount: 50000,
      risk_level: 'moderate',
      investment_horizon: 'medium',
      goal_id: ''
    });
    setSliderValue(50000);
    setShowResults(false);
    setErrors({});
  };

  // Return to form from results view
  const handleBack = () => {
    setShowResults(false);
  };

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Results view
  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Investment Recommendations</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Investment Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Investment Amount:</p>
              <p className="font-medium">{formatCurrency(formData.investment_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Profile:</p>
              <p className="font-medium capitalize">{formData.risk_level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Horizon:</p>
              <p className="font-medium capitalize">{formData.investment_horizon}</p>
            </div>
            {formData.goal_id && (
              <div>
                <p className="text-sm text-gray-600">Financial Goal:</p>
                <p className="font-medium">
                  {financialGoals.find(goal => goal.id === formData.goal_id)?.name || formData.goal_id}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {recommendations.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Recommended Investments</h3>
            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name || item.symbol}</h4>
                      <p className="text-sm text-gray-600">{item.type} • {item.sector || 'Diversified'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{formatCurrency(item.amount)}</p>
                      <p className="text-sm text-gray-600">{item.percentage}% of portfolio</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-yellow-800">
            No recommendations available. Please try different investment parameters.
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Form
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Investment Planner</h2>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Investment Amount */}
        <div>
          <label htmlFor="investment_amount" className="block text-sm font-medium text-gray-700 mb-1">
            Investment Amount (KES)
          </label>
          
          <div className="mb-2">
            <input
              type="number"
              id="investment_amount"
              name="investment_amount"
              value={formData.investment_amount}
              onChange={handleChange}
              min="1000"
              max="10000000"
              className={`w-full px-3 py-2 border ${errors.investment_amount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.investment_amount && (
              <p className="mt-1 text-sm text-red-600">{errors.investment_amount}</p>
            )}
          </div>
          
          {/* Slider for investment amount */}
          <div className="pt-2 pb-6">
            <input
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 px-1 mt-1">
              <span>KES 1,000</span>
              <span>KES 1,000,000</span>
            </div>
            <p className="text-center text-lg font-semibold text-blue-600 mt-2">
              {formatCurrency(formData.investment_amount)}
            </p>
          </div>
        </div>
        
        {/* Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Risk Tolerance Level
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              formData.risk_level === 'conservative' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`} onClick={() => handleChange({ target: { name: 'risk_level', value: 'conservative' } })}>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="risk_conservative"
                  name="risk_level"
                  value="conservative"
                  checked={formData.risk_level === 'conservative'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="risk_conservative" className="ml-2 text-md font-medium text-gray-800">
                  Conservative
                </label>
              </div>
              <p className="text-sm text-gray-600">Lower risk, stable returns. Focused on capital preservation.</p>
            </div>
            
            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              formData.risk_level === 'moderate' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`} onClick={() => handleChange({ target: { name: 'risk_level', value: 'moderate' } })}>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="risk_moderate"
                  name="risk_level"
                  value="moderate"
                  checked={formData.risk_level === 'moderate'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="risk_moderate" className="ml-2 text-md font-medium text-gray-800">
                  Moderate
                </label>
              </div>
              <p className="text-sm text-gray-600">Balanced approach with moderate risk for better growth potential.</p>
            </div>
            
            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              formData.risk_level === 'aggressive' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`} onClick={() => handleChange({ target: { name: 'risk_level', value: 'aggressive' } })}>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="risk_aggressive"
                  name="risk_level"
                  value="aggressive"
                  checked={formData.risk_level === 'aggressive'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="risk_aggressive" className="ml-2 text-md font-medium text-gray-800">
                  Aggressive
                </label>
              </div>
              <p className="text-sm text-gray-600">Higher risk with potential for higher returns. Focus on growth.</p>
            </div>
          </div>
          
          {errors.risk_level && (
            <p className="mt-1 text-sm text-red-600">{errors.risk_level}</p>
          )}
        </div>
        
        {/* Investment Horizon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Investment Time Horizon
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              formData.investment_horizon === 'short' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`} onClick={() => handleChange({ target: { name: 'investment_horizon', value: 'short' } })}>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="horizon_short"
                  name="investment_horizon"
                  value="short"
                  checked={formData.investment_horizon === 'short'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="horizon_short" className="ml-2 text-md font-medium text-gray-800">
                  Short-term
                </label>
              </div>
              <p className="text-sm text-gray-600">0-2 years. For near-term financial goals.</p>
            </div>
            
            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              formData.investment_horizon === 'medium' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`} onClick={() => handleChange({ target: { name: 'investment_horizon', value: 'medium' } })}>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="horizon_medium"
                  name="investment_horizon"
                  value="medium"
                  checked={formData.investment_horizon === 'medium'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="horizon_medium" className="ml-2 text-md font-medium text-gray-800">
                  Medium-term
                </label>
              </div>
              <p className="text-sm text-gray-600">2-5 years. For intermediate financial goals.</p>
            </div>
            
            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              formData.investment_horizon === 'long' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200'
            }`} onClick={() => handleChange({ target: { name: 'investment_horizon', value: 'long' } })}>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="horizon_long"
                  name="investment_horizon"
                  value="long"
                  checked={formData.investment_horizon === 'long'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="horizon_long" className="ml-2 text-md font-medium text-gray-800">
                  Long-term
                </label>
              </div>
              <p className="text-sm text-gray-600">5+ years. For long-term growth and wealth building.</p>
            </div>
          </div>
          
          {errors.investment_horizon && (
            <p className="mt-1 text-sm text-red-600">{errors.investment_horizon}</p>
          )}
        </div>
        
        {/* Financial Goal */}
        <div>
          <label htmlFor="goal_id" className="block text-sm font-medium text-gray-700 mb-1">
            Financial Goal (Optional)
          </label>
          <select
            id="goal_id"
            name="goal_id"
            value={formData.goal_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a financial goal (optional)</option>
            {financialGoals.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Selecting a specific goal helps us tailor the recommendations to your needs.
          </p>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
          >
            {isSubmitting ? 'Generating Recommendations...' : 'Get Investment Recommendations'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentForm;