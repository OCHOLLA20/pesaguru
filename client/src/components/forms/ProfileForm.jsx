import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, getUserProfile } from '../../api/user';

const ProfileForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredLanguage: 'en', // Default to English
    monthlyIncome: '',
    monthlyExpenses: '',
    riskProfile: 'moderate', // Default to moderate risk
    financialGoals: [],
    employmentStatus: '',
    occupation: '',
    dateOfBirth: '',
    location: '',
    hasInvestments: false,
    hasLoans: false
  });

  // Financial goal options
  const goalOptions = [
    { id: 'retirement', label: 'Retirement Planning' },
    { id: 'home', label: 'Home Purchase' },
    { id: 'education', label: 'Education Fund' },
    { id: 'emergency', label: 'Emergency Fund' },
    { id: 'business', label: 'Business Investment' },
    { id: 'travel', label: 'Travel/Vacation' },
    { id: 'debt', label: 'Debt Repayment' }
  ];

  // Employment status options
  const employmentOptions = [
    { value: 'employed', label: 'Employed' },
    { value: 'self-employed', label: 'Self-Employed' },
    { value: 'business-owner', label: 'Business Owner' },
    { value: 'student', label: 'Student' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'retired', label: 'Retired' }
  ];

  // Load user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const profileData = await getUserProfile();
        
        // Update form with existing profile data
        setFormData(prevData => ({
          ...prevData,
          ...profileData,
          // Ensure financial goals are properly formatted
          financialGoals: profileData.financialGoals || []
        }));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setMessage({
          type: 'error',
          text: 'Unable to load your profile data. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else if (name === 'monthlyIncome' || name === 'monthlyExpenses') {
      // Convert string to number for income/expenses fields
      setFormData(prevData => ({
        ...prevData,
        [name]: value === '' ? '' : parseFloat(value)
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle financial goals selection (checkboxes)
  const handleGoalChange = (goalId) => {
    setFormData(prevData => {
      const currentGoals = [...prevData.financialGoals];
      
      if (currentGoals.includes(goalId)) {
        // Remove goal if already selected
        return {
          ...prevData,
          financialGoals: currentGoals.filter(id => id !== goalId)
        };
      } else {
        // Add goal if not selected
        return {
          ...prevData,
          financialGoals: [...currentGoals, goalId]
        };
      }
    });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phoneNumber) {
        throw new Error('Please fill out all required fields.');
      }

      // Update user profile in the backend
      await updateUserProfile(formData);
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      
      // Redirect to dashboard after successful update (optional)
      // setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Profile</h2>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="e.g., +254XXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City/Town, County"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Employment Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Employment Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {employmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Financial Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Income (KES)
              </label>
              <input
                type="number"
                id="monthlyIncome"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="e.g., 50000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={handleChange}
                placeholder="e.g., 30000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasInvestments"
                name="hasInvestments"
                checked={formData.hasInvestments}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="hasInvestments" className="block text-sm font-medium text-gray-700">
                I have existing investments
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasLoans"
                name="hasLoans"
                checked={formData.hasLoans}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="hasLoans" className="block text-sm font-medium text-gray-700">
                I have outstanding loans
              </label>
            </div>
          </div>
        </div>
        
        {/* Risk Profile */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Investment Risk Profile</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              How would you describe your risk tolerance when it comes to investing?
            </p>
            
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="risk-conservative"
                name="riskProfile"
                value="conservative"
                checked={formData.riskProfile === 'conservative'}
                onChange={handleChange}
                className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="risk-conservative" className="text-sm font-medium text-gray-700">
                Conservative - I prefer stable, low-risk investments even if they offer lower returns
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="risk-moderate"
                name="riskProfile"
                value="moderate"
                checked={formData.riskProfile === 'moderate'}
                onChange={handleChange}
                className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="risk-moderate" className="text-sm font-medium text-gray-700">
                Moderate - I can accept some risk for potentially higher returns
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="risk-aggressive"
                name="riskProfile"
                value="aggressive"
                checked={formData.riskProfile === 'aggressive'}
                onChange={handleChange}
                className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="risk-aggressive" className="text-sm font-medium text-gray-700">
                Aggressive - I'm comfortable with high risk for potentially higher returns
              </label>
            </div>
          </div>
        </div>
        
        {/* Financial Goals */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Financial Goals</h3>
          <p className="text-sm text-gray-600 mb-3">
            Select your financial goals (you can choose multiple):
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goalOptions.map(goal => (
              <div key={goal.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`goal-${goal.id}`}
                  checked={formData.financialGoals.includes(goal.id)}
                  onChange={() => handleGoalChange(goal.id)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`goal-${goal.id}`} className="text-sm font-medium text-gray-700">
                  {goal.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;