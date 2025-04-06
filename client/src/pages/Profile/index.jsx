import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../context/AuthContext';
import ProfileSkeleton from '../../components/common/ProfileSkeleton';
import ErrorAlert from '../../components/common/ErrorAlert';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userProfile, isLoading, error, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    preferred_language: 'en',
    monthly_income: 0,
    monthly_expenses: 0,
    risk_profile: 'moderate'
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        phone_number: userProfile.phone_number || '',
        preferred_language: userProfile.preferred_language || 'en',
        monthly_income: userProfile.monthly_income || 0,
        monthly_expenses: userProfile.monthly_expenses || 0,
        risk_profile: userProfile.risk_profile || 'moderate'
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthly_income' || name === 'monthly_expenses' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:p-10">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-800">
              {user?.full_name?.charAt(0) || userProfile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{userProfile?.full_name}</h1>
              <p className="text-indigo-100">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-5 sm:p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    {t('profile.fullName')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                    {t('profile.phoneNumber')}
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-700">
                    {t('profile.preferredLanguage')}
                  </label>
                  <div className="mt-1">
                    <select
                      id="preferred_language"
                      name="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="sw">Kiswahili</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="risk_profile" className="block text-sm font-medium text-gray-700">
                    {t('profile.riskProfile')}
                  </label>
                  <div className="mt-1">
                    <select
                      id="risk_profile"
                      name="risk_profile"
                      value={formData.risk_profile}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="conservative">{t('investments.risk.conservative')}</option>
                      <option value="moderate">{t('investments.risk.moderate')}</option>
                      <option value="aggressive">{t('investments.risk.aggressive')}</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="monthly_income" className="block text-sm font-medium text-gray-700">
                    {t('profile.monthlyIncome')} (KES)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="monthly_income"
                      id="monthly_income"
                      value={formData.monthly_income}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="monthly_expenses" className="block text-sm font-medium text-gray-700">
                    {t('profile.monthlyExpenses')} (KES)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="monthly_expenses"
                      id="monthly_expenses"
                      value={formData.monthly_expenses}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="border-b border-gray-200 pb-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('profile.personalInfo')}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('profile.detailsSubtitle')}</p>
              </div>
              
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">{t('profile.fullName')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userProfile?.full_name}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">{t('profile.email')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">{t('profile.phoneNumber')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userProfile?.phone_number || '—'}</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">{t('profile.preferredLanguage')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userProfile?.preferred_language === 'sw' ? 'Kiswahili' : 'English'}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-b border-gray-200 mt-6 pt-6 pb-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('profile.financialInfo')}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('profile.financialSubtitle')}</p>
              </div>

              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">{t('profile.monthlyIncome')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userProfile?.monthly_income 
                      ? `KES ${userProfile.monthly_income.toLocaleString()}`
                      : '—'}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">{t('profile.monthlyExpenses')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userProfile?.monthly_expenses 
                      ? `KES ${userProfile.monthly_expenses.toLocaleString()}`
                      : '—'}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">{t('profile.riskProfile')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userProfile?.risk_profile 
                      ? t(`investments.risk.${userProfile.risk_profile}`)
                      : '—'}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('profile.editProfile')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;