import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoanComparisons } from '../../api/loan';
import { useUserProfile } from '../../hooks/useUserProfile';

// Components
import LoanComparisonTable from '../../components/Loan/LoanComparisonTable';
import LoanCalculator from '../../components/forms/LoanCalculator';
import AffordabilityChart from '../../components/charts/AffordabilityChart';

const LoanComparison = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculatorValues, setCalculatorValues] = useState({
    loanAmount: 100000,
    interestRate: 14,
    loanTerm: 12,
  });
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('table'); // 'table' or 'chart'

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        setIsLoading(true);
        const data = await getLoanComparisons();
        setLoans(data);
        // Pre-select the first two loans for comparison
        if (data.length >= 2) {
          setSelectedLoans([data[0].id, data[1].id]);
        } else if (data.length === 1) {
          setSelectedLoans([data[0].id]);
        }
      } catch (err) {
        console.error('Error fetching loan data:', err);
        setError('Failed to load loan options. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanData();
  }, []);

  const handleCalculatorChange = (name, value) => {
    setCalculatorValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoanSelection = (loanId) => {
    setSelectedLoans(prev => {
      // If already selected, remove it
      if (prev.includes(loanId)) {
        return prev.filter(id => id !== loanId);
      }
      
      // If less than 3 loans are selected, add it
      if (prev.length < 3) {
        return [...prev, loanId];
      }
      
      // Otherwise, replace the first one (FIFO)
      const newSelection = [...prev];
      newSelection.shift();
      return [...newSelection, loanId];
    });
  };

  const getSelectedLoans = () => {
    return loans.filter(loan => selectedLoans.includes(loan.id));
  };

  // EMI calculation function
  const calculateEMI = (principal, rate, time) => {
    const monthlyRate = rate / 100 / 12;
    const months = time;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    ).toFixed(2);
  };

  // Calculate EMI based on current calculator values
  const currentEMI = calculateEMI(
    calculatorValues.loanAmount,
    calculatorValues.interestRate,
    calculatorValues.loanTerm
  );

  // Calculate monthly income needed (using 40% DTI ratio)
  const requiredMonthlyIncome = (parseFloat(currentEMI) / 0.4).toFixed(2);

  // Affordability indication based on user profile
  const isAffordable = userProfile && userProfile.monthlyIncome >= requiredMonthlyIncome;

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-600">Loading loan options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md text-center">
          <h3 className="text-red-800 font-medium mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h3 className="text-xl font-semibold mb-4">No Loan Products Available</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any loan products at the moment. Please check back later or contact our support team.
          </p>
          <button
            onClick={() => navigate('/chatbot')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ask PesaGuru for Help
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Loan Comparison</h1>
      
      {/* Loan Calculator Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Loan Calculator</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoanCalculator 
              values={calculatorValues}
              onChange={handleCalculatorChange}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-bold text-lg">KES {parseFloat(currentEMI).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Payment:</span>
                <span className="font-medium">
                  KES {(parseFloat(currentEMI) * calculatorValues.loanTerm).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-medium">
                  KES {((parseFloat(currentEMI) * calculatorValues.loanTerm) - calculatorValues.loanAmount).toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Required Monthly Income:</span>
                  <span className="font-medium">KES {parseFloat(requiredMonthlyIncome).toLocaleString()}</span>
                </div>
                {userProfile && (
                  <div className="mt-3 p-2 rounded-md bg-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Your Monthly Income:</span>
                      <span className="font-medium">KES {userProfile.monthlyIncome?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="mt-2">
                      {isAffordable ? (
                        <div className="text-green-600 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>This loan is affordable based on your income</span>
                        </div>
                      ) : (
                        <div className="text-red-600 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span>This loan may be difficult to afford</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loan Comparison Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">Available Loan Options</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setComparisonMode('table')}
              className={`px-3 py-1 rounded-md ${
                comparisonMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setComparisonMode('chart')}
              className={`px-3 py-1 rounded-md ${
                comparisonMode === 'chart' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Chart View
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Select up to 3 loans to compare. Currently comparing: {selectedLoans.length} loans
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {loans.map((loan) => (
              <button
                key={loan.id}
                onClick={() => handleLoanSelection(loan.id)}
                className={`p-3 rounded-md border text-left transition-colors ${
                  selectedLoans.includes(loan.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{loan.lender}</div>
                <div className="text-sm text-gray-600">{loan.name}</div>
                <div className="mt-1 font-semibold text-blue-600">{loan.interestRate}%</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Comparison View (Table or Chart) */}
        {comparisonMode === 'table' ? (
          <LoanComparisonTable 
            loans={getSelectedLoans()} 
            loanAmount={calculatorValues.loanAmount}
            loanTerm={calculatorValues.loanTerm}
          />
        ) : (
          <div className="h-96">
            <AffordabilityChart 
              loans={getSelectedLoans()}
              loanAmount={calculatorValues.loanAmount}
              loanTerm={calculatorValues.loanTerm}
              monthlyIncome={userProfile?.monthlyIncome || 0}
            />
          </div>
        )}
      </div>
      
      {/* Call to Action Section */}
      <div className="bg-blue-50 rounded-lg shadow p-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-blue-800">Need personalized loan advice?</h3>
          <p className="text-blue-600 mt-1">
            Chat with PesaGuru to get tailored recommendations based on your financial profile.
          </p>
        </div>
        <button 
          onClick={() => navigate('/chatbot')}
          className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Ask PesaGuru
        </button>
      </div>
    </div>
  );
};

export default LoanComparison;