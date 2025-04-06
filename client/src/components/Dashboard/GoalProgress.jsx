import React, { useState } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * GoalCard - Displays an individual financial goal with progress
 */
const GoalCard = ({ goal }) => {
  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  
  // Determine status
  let statusColor = "bg-yellow-500"; // Default: in progress
  let statusText = "In Progress";
  
  if (progressPercent >= 100) {
    statusColor = "bg-green-500";
    statusText = "Achieved";
  } else if (goal.isOnTrack === false) {
    statusColor = "bg-red-500";
    statusText = "Behind";
  } else if (goal.isOnTrack) {
    statusColor = "bg-blue-500";
    statusText = "On Track";
  }

  // Calculate time remaining
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{goal.name}</h3>
          <p className="text-sm text-gray-600">{goal.description}</p>
        </div>
        <span className={`${statusColor} text-white text-xs px-2 py-1 rounded-full`}>
          {statusText}
        </span>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>{progressPercent}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-xs text-gray-500">Current</p>
          <p className="font-medium">{formatCurrency(goal.currentAmount, 'KES')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Target</p>
          <p className="font-medium">{formatCurrency(goal.targetAmount, 'KES')}</p>
        </div>
      </div>
      
      <div className="border-t pt-3 flex justify-between">
        <div>
          <p className="text-xs text-gray-500">Target Date</p>
          <p className="text-sm">{formatDate(goal.targetDate)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Time Remaining</p>
          <p className={`text-sm font-medium ${daysRemaining < 30 ? 'text-red-600' : 'text-gray-800'}`}>
            {daysRemaining <= 0 ? 'Expired' : `${daysRemaining} days`}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * LoadingSkeleton - Displays a loading placeholder for goals
 */
const LoadingSkeleton = () => (
  <div className="bg-white p-5 rounded-lg shadow-md animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="w-1/2">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4"></div>
    
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
    
    <div className="border-t pt-3 flex justify-between">
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

/**
 * EmptyState - Displayed when user has no financial goals
 */
const EmptyState = ({ onCreateGoal }) => (
  <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <svg 
      className="mx-auto h-12 w-12 text-gray-400" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No financial goals</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating your first financial goal.</p>
    <div className="mt-6">
      <button
        type="button"
        onClick={onCreateGoal}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg 
          className="-ml-1 mr-2 h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
            clipRule="evenodd" 
          />
        </svg>
        Create Goal
      </button>
    </div>
  </div>
);

/**
 * GoalProgress - Main component displaying user's financial goals
 */
const GoalProgress = () => {
  const { userProfile, isLoading, error } = useUserProfile();
  const [showAddGoal, setShowAddGoal] = useState(false);

  const handleCreateGoal = () => {
    setShowAddGoal(true);
    // This would typically open a modal or navigate to a goal creation form
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Financial Goals</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">Could not load your financial goals.</p>
        <button className="mt-2 text-sm text-red-600 underline">Retry</button>
      </div>
    );
  }

  const { financialGoals = [] } = userProfile || {};

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Financial Goals</h2>
        <button
          onClick={handleCreateGoal}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Goal
        </button>
      </div>

      {financialGoals.length === 0 ? (
        <EmptyState onCreateGoal={handleCreateGoal} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {financialGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalProgress;