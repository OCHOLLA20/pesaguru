import React, { useState, useEffect } from 'react';

// Mock data for demonstration
const mockGoals = [
  {
    id: 1,
    name: 'Buy a Home',
    category: 'housing',
    targetAmount: 2000000,
    currentAmount: 800000,
    targetDate: '2026-12-31',
    description: 'Save for a down payment on a house in Nairobi'
  },
  {
    id: 2,
    name: 'Emergency Fund',
    category: 'savings',
    targetAmount: 300000,
    currentAmount: 150000,
    targetDate: '2025-06-30',
    description: '6 months of living expenses'
  },
  {
    id: 3,
    name: 'Retirement',
    category: 'retirement',
    targetAmount: 5000000,
    currentAmount: 1000000,
    targetDate: '2040-01-01',
    description: 'Long-term retirement savings'
  }
];

// Simple loading spinner component
const LoadingSpinner = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-gray-600">{label}</p>
  </div>
);

// Simple error alert component
const ErrorAlert = ({ message }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">
    <p>{message}</p>
  </div>
);

// Goal progress card component
const GoalProgressCard = ({ goal, onEdit, onDelete }) => {
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const formattedCurrentAmount = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(goal.currentAmount);
  const formattedTargetAmount = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(goal.targetAmount);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };

  // Calculate time remaining
  const calculateTimeRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = Math.abs(target - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} remaining`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    }
  };

  // Category colors and icons mapping
  const categoryColors = {
    savings: 'bg-blue-100 text-blue-800',
    investment: 'bg-green-100 text-green-800',
    debt: 'bg-red-100 text-red-800',
    education: 'bg-purple-100 text-purple-800',
    retirement: 'bg-amber-100 text-amber-800',
    housing: 'bg-emerald-100 text-emerald-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${categoryColors[goal.category]}`}>
              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onEdit}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={onDelete}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Current</p>
            <p className="font-semibold">{formattedCurrentAmount}</p>
          </div>
          <div>
            <p className="text-gray-600">Target</p>
            <p className="font-semibold">{formattedTargetAmount}</p>
          </div>
          <div>
            <p className="text-gray-600">Target Date</p>
            <p className="font-semibold">{formatDate(goal.targetDate)}</p>
          </div>
          <div>
            <p className="text-gray-600">Timeframe</p>
            <p className="font-semibold">{calculateTimeRemaining(goal.targetDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Goal form component
const GoalForm = ({ initialValues = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'savings',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: '',
    ...initialValues
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Goal name is required';
    if (!formData.targetAmount) newErrors.targetAmount = 'Target amount is required';
    if (formData.targetAmount <= 0) newErrors.targetAmount = 'Target amount must be greater than 0';
    if (!formData.targetDate) newErrors.targetDate = 'Target date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
          placeholder="e.g. Buy a Home, Emergency Fund"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="savings">Savings</option>
          <option value="investment">Investment</option>
          <option value="debt">Debt Repayment</option>
          <option value="education">Education</option>
          <option value="retirement">Retirement</option>
          <option value="housing">Housing</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Target Amount (KES)</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.targetAmount ? 'border-red-500' : ''}`}
            placeholder="e.g. 500000"
          />
          {errors.targetAmount && <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>}
        </div>

        <div>
          <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700">Current Amount (KES)</label>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g. 100000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">Target Date</label>
        <input
          type="date"
          id="targetDate"
          name="targetDate"
          value={formData.targetDate}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.targetDate ? 'border-red-500' : ''}`}
        />
        {errors.targetDate && <p className="mt-1 text-sm text-red-600">{errors.targetDate}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Brief description of your financial goal"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialValues.id ? 'Update Goal' : 'Create Goal'}
        </button>
      </div>
    </form>
  );
};

const Goals = () => {
  // State for goals
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Simulate fetching goals from an API
  useEffect(() => {
    // Simulating API request delay
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setGoals(mockGoals);
        setError(null);
      } catch (err) {
        setError('Failed to fetch financial goals. Please try again later.');
        console.error('Error fetching goals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleAddGoal = async (goalData) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Generate a new ID (in a real app, the backend would do this)
      const newGoal = {
        ...goalData,
        id: Math.max(0, ...goals.map(g => g.id)) + 1
      };
      
      setGoals([...goals, newGoal]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create goal:', err);
      // Show error message
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleUpdateGoal = async (goalData) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const updatedGoal = {
        ...goalData,
        id: editingGoal.id
      };
      
      setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
      setIsModalOpen(false);
      setEditingGoal(null);
    } catch (err) {
      console.error('Failed to update goal:', err);
      // Show error message
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        setGoals(goals.filter(goal => goal.id !== goalId));
      } catch (err) {
        console.error('Failed to delete goal:', err);
        // Show error message
      }
    }
  };

  const filteredGoals = filterCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === filterCategory);

  if (isLoading) {
    return <LoadingSpinner label="Loading your financial goals..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Goals</h1>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <div className="relative">
            <select
              className="bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="debt">Debt Repayment</option>
              <option value="education">Education</option>
              <option value="retirement">Retirement</option>
              <option value="housing">Housing</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Goal
          </button>
        </div>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="bg-blue-100 inline-block p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Financial Goals Yet</h2>
          <p className="text-gray-600 mb-4">
            Define your financial goals to track your progress and get personalized advice.
          </p>
          <button
            onClick={() => {
              setEditingGoal(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalProgressCard
              key={goal.id}
              goal={goal}
              onEdit={() => handleEditGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-90 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingGoal ? 'Edit Financial Goal' : 'Create New Financial Goal'}
              </h2>
              <GoalForm
                initialValues={editingGoal || {}}
                onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingGoal(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;