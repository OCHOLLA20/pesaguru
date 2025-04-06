import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../context/AuthContext';
import Switch from '../../components/common/Switch';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useTheme } from '../../context/ThemeContext';

const Preferences = () => {
  const { t, i18n } = useTranslation();
  const { userProfile, isLoading, error, updateProfile } = useUserProfile();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    notifyInvestmentOpportunities: true,
    notifyMarketChanges: true,
    notifyGoalProgress: true,
    showAmounts: true,
    defaultDashboardView: 'overview',
    privacyLevel: 'standard'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile?.preferences) {
      setPreferences({
        ...preferences,
        ...userProfile.preferences,
        language: userProfile.preferred_language || 'en',
        theme: theme
      });
    }
  }, [userProfile, theme]);

  const handleToggleChange = (name) => {
    setPreferences(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (language) => {
    setPreferences(prev => ({
      ...prev,
      language
    }));
    i18n.changeLanguage(language);
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setPreferences(prev => ({
      ...prev,
      theme: newTheme
    }));
    toggleTheme();
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      await updateProfile({
        preferred_language: preferences.language,
        preferences: {
          notifyInvestmentOpportunities: preferences.notifyInvestmentOpportunities,
          notifyMarketChanges: preferences.notifyMarketChanges,
          notifyGoalProgress: preferences.notifyGoalProgress,
          showAmounts: preferences.showAmounts,
          defaultDashboardView: preferences.defaultDashboardView,
          privacyLevel: preferences.privacyLevel
        }
      });
      
      // Save theme preference to localStorage
      localStorage.setItem('theme-preference', preferences.theme);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setSaveError(t('preferences.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {t('preferences.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('preferences.description')}
          </p>
        </div>
        
        <div className="px-6 py-5 space-y-6">
          {/* Appearance Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white">{t('preferences.appearance')}</h4>
            <div className="mt-4 space-y-4">
              {/* Language Preference */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('preferences.language')}</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      preferences.language === 'en' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('sw')}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      preferences.language === 'sw' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Kiswahili
                  </button>
                </div>
              </div>
              
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('preferences.theme')}</span>
                <Switch 
                  enabled={preferences.theme === 'dark'} 
                  onChange={handleThemeChange}
                  label={preferences.theme === 'dark' ? t('preferences.darkMode') : t('preferences.lightMode')}
                />
              </div>

              {/* Dashboard View */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('preferences.defaultDashboardView')}</span>
                <select
                  name="defaultDashboardView"
                  value={preferences.defaultDashboardView}
                  onChange={handleSelectChange}
                  className="block w-40 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700 dark:text-gray-300"
                >
                  <option value="overview">{t('preferences.overview')}</option>
                  <option value="investments">{t('preferences.investments')}</option>
                  <option value="goals">{t('preferences.goals')}</option>
                  <option value="chatbot">{t('preferences.chatbot')}</option>
                </select>
              </div>

              {/* Show Amounts Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('preferences.showAmounts')}</span>
                <Switch 
                  enabled={preferences.showAmounts} 
                  onChange={() => handleToggleChange('showAmounts')}
                />
              </div>
            </div>
          </div>
          
          {/* Notifications Section */}
          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">{t('preferences.notifications')}</h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('preferences.notifyInvestmentOpportunities')}</span>
                <Switch 
                  enabled={preferences.notifyInvestmentOpportunities} 
                  onChange={() => handleToggleChange('notifyInvestmentOpportunities')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('preferences.notifyMarketChanges')}</span>
                <Switch 
                  enabled={preferences.notifyMarketChanges} 
                  onChange={() => handleToggleChange('notifyMarketChanges')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('preferences.notifyGoalProgress')}</span>
                <Switch 
                  enabled={preferences.notifyGoalProgress} 
                  onChange={() => handleToggleChange('notifyGoalProgress')}
                />
              </div>
            </div>
          </div>
          
          {/* Privacy Section */}
          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">{t('preferences.privacy')}</h4>
            <div className="mt-4">
              <label htmlFor="privacyLevel" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                {t('preferences.privacyLevel')}
              </label>
              <select
                id="privacyLevel"
                name="privacyLevel"
                value={preferences.privacyLevel}
                onChange={handleSelectChange}
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700 dark:text-gray-300"
              >
                <option value="minimal">{t('preferences.privacyMinimal')}</option>
                <option value="standard">{t('preferences.privacyStandard')}</option>
                <option value="strict">{t('preferences.privacyStrict')}</option>
              </select>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {preferences.privacyLevel === 'minimal' && t('preferences.privacyMinimalDescription')}
                {preferences.privacyLevel === 'standard' && t('preferences.privacyStandardDescription')}
                {preferences.privacyLevel === 'strict' && t('preferences.privacyStrictDescription')}
              </p>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-5 flex justify-end">
            {saveSuccess && (
              <div className="mr-4 text-sm text-green-600 dark:text-green-400 flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('preferences.saveSuccess')}
              </div>
            )}
            {saveError && (
              <div className="mr-4 text-sm text-red-600 dark:text-red-400">
                {saveError}
              </div>
            )}
            <button
              type="button"
              onClick={savePreferences}
              disabled={isSaving}
              className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isSaving ? t('common.saving') : t('common.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;