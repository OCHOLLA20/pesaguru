import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { updateUserProfile } from '../../api/user';

const Settings = () => {
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phoneNumber: '',
    
    // Financial Profile
    monthlyIncome: '',
    monthlyExpenses: '',
    riskProfile: 'moderate', // conservative, moderate, aggressive
    
    // Preferences
    preferredLanguage: 'en', // en, sw
    notifyMarketUpdates: true,
    notifyInvestmentOpportunities: true,
    notifyGoalProgress: true,
    
    // Security
    enableTwoFactor: false,
  });

  // Load user data when available
  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.full_name || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phone_number || '',
        monthlyIncome: userProfile.monthly_income || '',
        monthlyExpenses: userProfile.monthly_expenses || '',
        riskProfile: userProfile.risk_profile || 'moderate',
        preferredLanguage: userProfile.preferred_language || 'en',
        notifyMarketUpdates: userProfile.notify_market_updates || true,
        notifyInvestmentOpportunities: userProfile.notify_investment_opportunities || true,
        notifyGoalProgress: userProfile.notify_goal_progress || true,
        enableTwoFactor: userProfile.enable_two_factor || false,
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await updateUserProfile({
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        monthly_income: parseFloat(formData.monthlyIncome),
        monthly_expenses: parseFloat(formData.monthlyExpenses),
        risk_profile: formData.riskProfile,
        preferred_language: formData.preferredLanguage,
        notify_market_updates: formData.notifyMarketUpdates,
        notify_investment_opportunities: formData.notifyInvestmentOpportunities,
        notify_goal_progress: formData.notifyGoalProgress,
        enable_two_factor: formData.enableTwoFactor,
      });
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Refresh user profile data
      fetchUserProfile();
    } catch (err) {
      setFormError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
          Failed to load profile data. Please refresh the page.
        </div>
      )}
      
      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded mb-6 transition-opacity">
          Your settings have been successfully updated!
        </div>
      )}
      
      {/* Form error message */}
      {formError && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
          {formError}
        </div>
      )}
      
      {/* Settings navigation tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'financial' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial Profile
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'preferences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleInputChange}
                placeholder="+254712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
        
        {/* Financial Profile Section */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Financial Profile</h2>
            <div>
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Income (KES)
              </label>
              <input 
                type="number" 
                id="monthlyIncome" 
                name="monthlyIncome" 
                value={formData.monthlyIncome} 
                onChange={handleInputChange}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Expenses (KES)
              </label>
              <input 
                type="number" 
                id="monthlyExpenses" 
                name="monthlyExpenses" 
                value={formData.monthlyExpenses} 
                onChange={handleInputChange}
                placeholder="e.g. 30000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="riskProfile" className="block text-sm font-medium text-gray-700 mb-1">
                Risk Tolerance
              </label>
              <select 
                id="riskProfile" 
                name="riskProfile"
                value={formData.riskProfile}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="conservative">Conservative - Lower risk, lower return</option>
                <option value="moderate">Moderate - Balanced risk and return</option>
                <option value="aggressive">Aggressive - Higher risk, higher potential return</option>
              </select>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What does this mean?</h3>
              <p className="text-sm text-blue-700">
                Your risk profile determines the type of investments we'll recommend. A conservative profile focuses on safety, a moderate profile balances growth and safety, while an aggressive profile prioritizes growth potential despite higher volatility.
              </p>
            </div>
          </div>
        )}
        
        {/* Preferences Section */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Preferences</h2>
            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language
              </label>
              <select 
                id="preferredLanguage" 
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700">Notification Preferences</h3>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="notifyMarketUpdates" 
                  name="notifyMarketUpdates"
                  checked={formData.notifyMarketUpdates}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyMarketUpdates" className="ml-2 block text-sm text-gray-700">
                  Market Updates & News
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="notifyInvestmentOpportunities" 
                  name="notifyInvestmentOpportunities"
                  checked={formData.notifyInvestmentOpportunities}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyInvestmentOpportunities" className="ml-2 block text-sm text-gray-700">
                  Investment Opportunities
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="notifyGoalProgress" 
                  name="notifyGoalProgress"
                  checked={formData.notifyGoalProgress}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyGoalProgress" className="ml-2 block text-sm text-gray-700">
                  Financial Goal Progress
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Security Section */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Security</h2>
            
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="text-md font-medium text-gray-700">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="enableTwoFactor" 
                  name="enableTwoFactor"
                  checked={formData.enableTwoFactor}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-700">
                  Enable
                </label>
              </div>
            </div>
            
            <div className="py-4 border-b border-gray-200">
              <h3 className="text-md font-medium text-gray-700">Change Password</h3>
              <p className="text-sm text-gray-500 mb-4">Regularly updating your password helps keep your account secure</p>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => {/* Implement password change flow */}}
              >
                Change Password
              </button>
            </div>
            
            <div className="py-4">
              <h3 className="text-md font-medium text-gray-700">Active Sessions</h3>
              <p className="text-sm text-gray-500 mb-4">Manage and close your active sessions</p>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => {/* Implement session management */}}
              >
                Manage Sessions
              </button>
            </div>
          </div>
        )}
        
        {/* Save button */}
        <div className="mt-8">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;