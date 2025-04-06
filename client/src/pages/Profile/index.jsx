import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useUserProfile from '../../hooks/useUserProfile';
import { validateEmail, validatePhone } from '../../utils/validators';

// UI Components
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium rounded-t-lg ${
      active 
        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600' 
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

const ProfilePage = () => {
  const { t } = useTranslation();
  const { userProfile, isLoading, error, updateProfile } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    preferred_language: 'en',
    monthly_income: '',
    monthly_expenses: '',
    risk_profile: 'moderate'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load profile data when available
  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        phone_number: userProfile.phone_number || '',
        preferred_language: userProfile.preferred_language || 'en',
        monthly_income: userProfile.monthly_income || '',
        monthly_expenses: userProfile.monthly_expenses || '',
        risk_profile: userProfile.risk_profile || 'moderate'
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = t('profile.errors.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('profile.errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('profile.errors.invalidEmail');
    }
    
    if (formData.phone_number && !validatePhone(formData.phone_number)) {
      newErrors.phone_number = t('profile.errors.invalidPhone');
    }
    
    if (formData.monthly_income && isNaN(formData.monthly_income)) {
      newErrors.monthly_income = t('profile.errors.invalidIncome');
    }
    
    if (formData.monthly_expenses && isNaN(formData.monthly_expenses)) {
      newErrors.monthly_expenses = t('profile.errors.invalidExpenses');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process numerical values
      const processedData = {
        ...formData,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : undefined,
        monthly_expenses: formData.monthly_expenses ? parseFloat(formData.monthly_expenses) : undefined
      };
      
      await updateProfile(processedData);
      setSuccessMessage(t('profile.updateSuccess'));
    } catch (err) {
      setErrors({ submit: err.message || t('profile.updateError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('profile.title')}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <TabButton 
              active={activeTab === 'personal'} 
              onClick={() => setActiveTab('personal')}
            >
              {t('profile.tabs.personal')}
            </TabButton>
            <TabButton 
              active={activeTab === 'financial'} 
              onClick={() => setActiveTab('financial')}
            >
              {t('profile.tabs.financial')}
            </TabButton>
            <TabButton 
              active={activeTab === 'preferences'} 
              onClick={() => setActiveTab('preferences')}
            >
              {t('profile.tabs.preferences')}
            </TabButton>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.fullName')}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.full_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700`}
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="+254XXXXXXXXX"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700`}
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'financial' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.monthlyIncome')} (KES)
                  </label>
                  <input
                    type="number"
                    name="monthly_income"
                    value={formData.monthly_income}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.monthly_income ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700`}
                  />
                  {errors.monthly_income && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthly_income}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.monthlyExpenses')} (KES)
                  </label>
                  <input
                    type="number"
                    name="monthly_expenses"
                    value={formData.monthly_expenses}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.monthly_expenses ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700`}
                  />
                  {errors.monthly_expenses && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthly_expenses}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.riskProfile')}
                  </label>
                  <select
                    name="risk_profile"
                    value={formData.risk_profile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  >
                    <option value="conservative">{t('profile.riskLevels.conservative')}</option>
                    <option value="moderate">{t('profile.riskLevels.moderate')}</option>
                    <option value="aggressive">{t('profile.riskLevels.aggressive')}</option>
                  </select>
                </div>
              </div>
            )}
            
            {activeTab === 'preferences' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.language')}
                  </label>
                  <select
                    name="preferred_language"
                    value={formData.preferred_language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  >
                    <option value="en">{t('profile.languages.english')}</option>
                    <option value="sw">{t('profile.languages.swahili')}</option>
                  </select>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.security')}
                  </h3>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={() => alert('Password change functionality would be implemented here')}
                  >
                    {t('profile.changePassword')}
                  </button>
                </div>
              </div>
            )}
            
            {errors.submit && (
              <div className="mt-4 text-sm text-red-600">{errors.submit}</div>
            )}
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? t('profile.saving') : t('profile.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;