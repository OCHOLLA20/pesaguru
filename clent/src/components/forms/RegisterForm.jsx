import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
    agreeToTerms: false
  });

  // Password strength patterns
  const hasLetter = /[A-Za-z]/.test(formData.password);
  const hasDigit = /\d/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(formData.password);
  const isLongEnough = formData.password.length >= 8;
  
  // Calculate password strength
  const getPasswordStrength = () => {
    if (!formData.password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (hasLetter) score += 1;
    if (hasDigit) score += 1;
    if (hasSpecialChar) score += 1;
    if (isLongEnough) score += 1;
    
    const strengthLabels = [
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];
    
    return {
      score,
      ...strengthLabels[score - 1] || { label: '', color: '' }
    };
  };
  
  const passwordStrength = getPasswordStrength();
  
  // Helper to check if the form is valid
  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      /^(?:\+254|0)[17]\d{8}$/.test(formData.phoneNumber) && // Kenyan phone format
      passwordStrength.score >= 3 &&
      formData.password === formData.confirmPassword &&
      formData.agreeToTerms
    );
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
    // Validate form
    if (!isFormValid()) {
      if (!formData.agreeToTerms) {
        setError('You must agree to the Terms and Conditions');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (passwordStrength.score < 3) {
        setError('Please use a stronger password');
        return;
      }
      if (!/^(?:\+254|0)[17]\d{8}$/.test(formData.phoneNumber)) {
        setError('Please enter a valid Kenyan phone number (starting with +254 or 0)');
        return;
      }
      setError('Please fill out all required fields correctly');
      return;
    }
    
    // Attempt registration
    setIsSubmitting(true);
    try {
      // Prepare the user data (exclude confirmPassword)
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        preferredLanguage: formData.preferredLanguage
      };
      
      await register(userData);
      
      // Registration successful - redirect to onboarding or dashboard
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Email */}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Phone Number */}
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
            placeholder="+254XXXXXXXXX or 07XXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Format: +254XXXXXXXXX or 07XXXXXXXX</p>
        </div>
        
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">Password strength: </span>
                <span className={`text-xs ${passwordStrength.score >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                  {passwordStrength.label}
                </span>
              </div>
              
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-1 ${passwordStrength.color}`} 
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                ></div>
              </div>
              
              <ul className="mt-2 space-y-1 text-xs text-gray-600">
                <li className={`flex items-center ${isLongEnough ? 'text-green-600' : ''}`}>
                  <span className={`mr-1 ${isLongEnough ? 'text-green-600' : 'text-gray-400'}`}>
                    {isLongEnough ? '✓' : '○'}
                  </span>
                  At least 8 characters
                </li>
                <li className={`flex items-center ${hasLetter ? 'text-green-600' : ''}`}>
                  <span className={`mr-1 ${hasLetter ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasLetter ? '✓' : '○'}
                  </span>
                  Letters (A-Z, a-z)
                </li>
                <li className={`flex items-center ${hasDigit ? 'text-green-600' : ''}`}>
                  <span className={`mr-1 ${hasDigit ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasDigit ? '✓' : '○'}
                  </span>
                  Numbers (0-9)
                </li>
                <li className={`flex items-center ${hasSpecialChar ? 'text-green-600' : ''}`}>
                  <span className={`mr-1 ${hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasSpecialChar ? '✓' : '○'}
                  </span>
                  Special characters (!@#$%^&*)
                </li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              formData.confirmPassword && formData.password !== formData.confirmPassword
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } rounded-md focus:outline-none focus:ring-2`}
            required
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
        </div>
        
        {/* Preferred Language */}
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
        
        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
              I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
        
        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;