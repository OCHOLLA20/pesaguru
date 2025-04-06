// src/hooks/useUserProfile.js

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

/**
 * Custom hook for managing user profile data and interactions
 * Handles fetching, updating, and analyzing user financial information
 */
const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [riskProfile, setRiskProfile] = useState(null);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL - should be environment variable in production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  /**
   * Fetch user profile data from the server
   */
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUserProfile(response.data);
      
      // Update related states with data from the profile response
      if (response.data.financialGoals) {
        setFinancialGoals(response.data.financialGoals);
      }
      
      if (response.data.riskProfile) {
        setRiskProfile(response.data.riskProfile);
      }
      
      if (response.data.portfolioSummary) {
        setPortfolioSummary(response.data.portfolioSummary);
      }

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch user profile';
      setError(errorMsg);
      console.error('Profile fetch error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, API_URL]);

  /**
   * Update user profile data
   * @param {Object} profileData - User profile data to update
   */
  const updateProfile = useCallback(async (profileData) => {
    if (!isAuthenticated) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUserProfile(prevProfile => ({
        ...prevProfile,
        ...response.data
      }));

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      console.error('Profile update error:', err);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Update user's risk profile assessment
   * @param {Object} riskAssessment - New risk assessment data
   */
  const updateRiskProfile = useCallback(async (riskAssessment) => {
    if (!isAuthenticated) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/users/risk-profile`, riskAssessment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setRiskProfile(response.data);
      
      // Also update this info in the user profile
      setUserProfile(prevProfile => ({
        ...prevProfile,
        riskProfile: response.data
      }));

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update risk profile';
      setError(errorMsg);
      console.error('Risk profile update error:', err);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Fetch user's financial goals
   */
  const fetchFinancialGoals = useCallback(async () => {
    if (!isAuthenticated) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/users/goals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setFinancialGoals(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch financial goals';
      setError(errorMsg);
      console.error('Goals fetch error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Add a new financial goal
   * @param {Object} goalData - New goal data
   */
  const addFinancialGoal = useCallback(async (goalData) => {
    if (!isAuthenticated) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/users/goals`, goalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setFinancialGoals(prevGoals => [...prevGoals, response.data]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add financial goal';
      setError(errorMsg);
      console.error('Goal addition error:', err);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Update an existing financial goal
   * @param {string} goalId - ID of the goal to update
   * @param {Object} goalData - Updated goal data
   */
  const updateFinancialGoal = useCallback(async (goalId, goalData) => {
    if (!isAuthenticated) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_URL}/users/goals/${goalId}`, goalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setFinancialGoals(prevGoals => 
        prevGoals.map(goal => goal.id === goalId ? response.data : goal)
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update goal';
      setError(errorMsg);
      console.error('Goal update error:', err);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Delete a financial goal
   * @param {string} goalId - ID of the goal to delete
   */
  const deleteFinancialGoal = useCallback(async (goalId) => {
    if (!isAuthenticated) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_URL}/users/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setFinancialGoals(prevGoals => 
        prevGoals.filter(goal => goal.id !== goalId)
      );
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete goal';
      setError(errorMsg);
      console.error('Goal deletion error:', err);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Fetch transaction history
   * @param {Object} filters - Optional filters for transactions
   */
  const fetchTransactionHistory = useCallback(async (filters = {}) => {
    if (!isAuthenticated) {
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const response = await axios.get(`${API_URL}/users/transactions?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setTransactionHistory(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch transaction history';
      setError(errorMsg);
      console.error('Transaction history fetch error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Update language preference
   * @param {string} language - Language code (e.g., 'en', 'sw')
   */
  const updateLanguagePreference = useCallback(async (language) => {
    if (!isAuthenticated) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_URL}/users/preferences/language`, 
        { preferredLanguage: language },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update the user profile with the new language preference
      setUserProfile(prevProfile => ({
        ...prevProfile,
        preferredLanguage: language
      }));

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update language preference';
      setError(errorMsg);
      console.error('Language preference update error:', err);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, API_URL]);

  /**
   * Get progress on a specific financial goal
   * @param {string} goalId - ID of the goal to check progress on
   * @returns {Object} Progress information
   */
  const getGoalProgress = useCallback((goalId) => {
    const goal = financialGoals.find(g => g.id === goalId);
    
    if (!goal) return null;
    
    // Calculate goal progress percentage
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    
    // Calculate time progress percentage
    const startDate = new Date(goal.startDate).getTime();
    const targetDate = new Date(goal.targetDate).getTime();
    const currentDate = new Date().getTime();
    const timeProgress = ((currentDate - startDate) / (targetDate - startDate)) * 100;
    
    // Determine if the goal is on track
    const isOnTrack = progress >= timeProgress;
    
    return {
      goal,
      progress: Math.min(progress, 100), // Cap at 100%
      timeProgress: Math.min(timeProgress, 100), // Cap at 100%
      isOnTrack,
      remainingAmount: goal.targetAmount - goal.currentAmount,
      daysRemaining: Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24))
    };
  }, [financialGoals]);

  // Load user profile data when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserProfile();
    }
  }, [isAuthenticated, user?.id, fetchUserProfile]);

  return {
    // Data states
    userProfile,
    financialGoals,
    riskProfile,
    portfolioSummary,
    transactionHistory,
    
    // Status states
    isLoading,
    error,
    
    // Core profile methods
    fetchUserProfile,
    updateProfile,
    updateRiskProfile,
    
    // Financial goals methods
    fetchFinancialGoals,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    getGoalProgress,
    
    // Transactions
    fetchTransactionHistory,
    
    // Preferences
    updateLanguagePreference
  };
};

export default useUserProfile;