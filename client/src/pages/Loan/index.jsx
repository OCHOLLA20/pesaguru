import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoans from '../../hooks/useLoans'; // Using default import

// Placeholder components - these would be imported from your components folder
import LoanCard from '../../components/Loan/LoanCard';
import LoanComparisonTable from '../../components/Loan/LoanComparisonTable';
import ChatbotSuggestion from '../../components/common/ChatbotSuggestion';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';

const LoanPage = () => {
  const navigate = useNavigate();
  const { loans, popularLoans, isLoading, error } = useLoans();
  const [comparisonLoans, setComparisonLoans] = useState([]);

  // Function to add or remove loans from comparison
  const toggleLoanComparison = (loanId) => {
    setComparisonLoans((prev) => {
      if (prev.includes(loanId)) {
        return prev.filter(id => id !== loanId);
      } else {
        return [...prev, loanId];
      }
    });
  };

  // Navigate to calculator page
  const navigateToCalculator = () => {
    navigate('/loans/calculator');
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading loan information..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Loan Management</h1>
        <p className="text-gray-600">Compare loan options and manage your current loans</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button 
          onClick={navigateToCalculator}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Loan Calculator
        </button>
        <button 
          onClick={() => navigate('/chatbot', { state: { intent: 'loan_advice' } })}
          className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg shadow flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Get Personalized Loan Advice
        </button>
      </div>

      {/* Current Loans Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Current Loans</h2>
        
        {loans && loans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loans.map(loan => (
              <LoanCard 
                key={loan.id} 
                loan={loan} 
                isSelected={comparisonLoans.includes(loan.id)}
                onToggleComparison={() => toggleLoanComparison(loan.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No Active Loans"
            description="You don't have any active loans at the moment."
            actionLabel="Explore Loan Options"
            onAction={() => navigate('/loans/comparison')}
          />
        )}
      </div>

      {/* Loan Comparison Section */}
      {comparisonLoans.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Comparison</h2>
          <LoanComparisonTable 
            loans={loans.filter(loan => comparisonLoans.includes(loan.id))} 
          />
        </div>
      )}

      {/* Popular Loan Options */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Loan Options</h2>
        
        {popularLoans && popularLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularLoans.map(loan => (
              <LoanCard 
                key={loan.id} 
                loan={loan} 
                isSelected={comparisonLoans.includes(loan.id)}
                onToggleComparison={() => toggleLoanComparison(loan.id)}
                isPopular={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">Loading popular loan options...</p>
          </div>
        )}
      </div>

      {/* Chatbot Suggestion */}
      <ChatbotSuggestion 
        title="Need help choosing the right loan?"
        description="Our AI assistant can help you analyze your needs and recommend the best loan options for your situation."
        buttonText="Ask PesaGuru"
        intent="loan_recommendation"
      />
    </div>
  );
};

export default LoanPage;