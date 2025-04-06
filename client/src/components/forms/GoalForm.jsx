import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const GoalForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      goalName: initialValues.goalName || '',
      goalType: initialValues.goalType || 'retirement',
      targetAmount: initialValues.targetAmount || '',
      targetDate: initialValues.targetDate || '',
      priority: initialValues.priority || 'medium',
      initialDeposit: initialValues.initialDeposit || '',
      monthlyContribution: initialValues.monthlyContribution || '',
      notes: initialValues.notes || '',
    }
  });

  const totalSteps = 3;
  const watchGoalType = watch('goalType');

  // Process form submission
  const processSubmit = (data) => {
    // Convert string amounts to numbers
    const processedData = {
      ...data,
      targetAmount: parseFloat(data.targetAmount),
      initialDeposit: parseFloat(data.initialDeposit) || 0,
      monthlyContribution: parseFloat(data.monthlyContribution) || 0,
    };
    
    onSubmit(processedData);
    reset();
    setCurrentStep(1);
  };

  // Step navigation
  const nextStep = () => setCurrentStep(currentStep < totalSteps ? currentStep + 1 : currentStep);
  const prevStep = () => setCurrentStep(currentStep > 1 ? currentStep - 1 : currentStep);

  // Goal type options
  const goalTypes = [
    { id: 'retirement', label: 'Retirement' },
    { id: 'education', label: 'Education' },
    { id: 'home', label: 'Home Purchase' },
    { id: 'emergency', label: 'Emergency Fund' },
    { id: 'vehicle', label: 'Vehicle Purchase' },
    { id: 'business', label: 'Business Startup' },
    { id: 'vacation', label: 'Vacation' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'other', label: 'Other' }
  ];

  // Dynamic suggested timeline based on goal type
  const getSuggestedTimeline = () => {
    switch(watchGoalType) {
      case 'retirement': return '20-30 years';
      case 'education': return '5-15 years';
      case 'home': return '5-10 years';
      case 'emergency': return '1-2 years';
      case 'vehicle': return '1-5 years';
      case 'business': return '2-5 years';
      case 'vacation': return '1-2 years';
      case 'wedding': return '1-3 years';
      default: return 'Depends on your goal';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Progress indicator */}
      <div className="w-full bg-gray-200 h-2 rounded-t-xl">
        <div 
          className="bg-blue-600 h-2 rounded-tl-xl transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Financial Goal' : 'Create a New Financial Goal'}
        </h2>
        
        <p className="text-sm text-gray-600 mb-6">
          Step {currentStep} of {totalSteps}: {
            currentStep === 1 ? 'Basic Information' : 
            currentStep === 2 ? 'Financial Details' : 
            'Additional Information'
          }
        </p>
        
        <form onSubmit={handleSubmit(processSubmit)}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="goalName" className="block text-sm font-medium text-gray-700">
                  Goal Name*
                </label>
                <input
                  id="goalName"
                  type="text"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.goalName ? 'border-red-300' : ''}`}
                  placeholder="e.g., My Retirement Fund"
                  {...register('goalName', { required: 'Please enter a name for your goal' })}
                />
                {errors.goalName && <p className="mt-1 text-sm text-red-600">{errors.goalName.message}</p>}
              </div>
              
              <div>
                <label htmlFor="goalType" className="block text-sm font-medium text-gray-700">
                  Goal Type*
                </label>
                <select
                  id="goalType"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  {...register('goalType', { required: 'Please select a goal type' })}
                >
                  {goalTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                {errors.goalType && <p className="mt-1 text-sm text-red-600">{errors.goalType.message}</p>}
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority Level
                </label>
                <select
                  id="priority"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  {...register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Step 2: Financial Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                  Target Amount (KES)*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">KES</span>
                  </div>
                  <input
                    id="targetAmount"
                    type="number"
                    className={`pl-16 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.targetAmount ? 'border-red-300' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="1"
                    {...register('targetAmount', { 
                      required: 'Please enter a target amount',
                      min: { value: 1, message: 'Amount must be greater than 0' }
                    })}
                  />
                </div>
                {errors.targetAmount && <p className="mt-1 text-sm text-red-600">{errors.targetAmount.message}</p>}
              </div>
              
              <div>
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                  Target Date*
                </label>
                <input
                  id="targetDate"
                  type="date"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.targetDate ? 'border-red-300' : ''}`}
                  {...register('targetDate', { required: 'Please select a target date' })}
                />
                {errors.targetDate && <p className="mt-1 text-sm text-red-600">{errors.targetDate.message}</p>}
                <p className="mt-1 text-xs text-gray-500">Suggested timeline: {getSuggestedTimeline()}</p>
              </div>
            </div>
          )}
          
          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700">
                  Initial Deposit (KES)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">KES</span>
                  </div>
                  <input
                    id="initialDeposit"
                    type="number"
                    className="pl-16 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="1"
                    {...register('initialDeposit')}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700">
                  Monthly Contribution (KES)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">KES</span>
                  </div>
                  <input
                    id="monthlyContribution"
                    type="number"
                    className="pl-16 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="0.00"
                    min="0"
                    step="1"
                    {...register('monthlyContribution')}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Any additional information about this goal"
                  {...register('notes')}
                ></textarea>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? 'Update Goal' : 'Create Goal'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;