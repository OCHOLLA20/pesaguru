import React, { useState, useEffect } from 'react';

const LoanCalculator = () => {
  // Form state
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTerm, setLoanTerm] = useState(3);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Results state
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  
  // Extra comparison loan (for comparison feature)
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonRate, setComparisonRate] = useState(11);
  const [comparisonTerm, setComparisonTerm] = useState(5);
  const [comparisonResults, setComparisonResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    savings: 0
  });

  // Calculate loan details when inputs change
  useEffect(() => {
    calculateLoan();
    if (showComparison) {
      calculateComparison();
    }
  }, [loanAmount, interestRate, loanTerm, paymentFrequency, showComparison, comparisonRate, comparisonTerm]);

  // Get payments per year based on frequency
  const getPaymentsPerYear = () => {
    switch (paymentFrequency) {
      case 'weekly': return 52;
      case 'biweekly': return 26;
      case 'monthly': return 12;
      case 'quarterly': return 4;
      default: return 12;
    }
  };

  // Calculate loan details
  const calculateLoan = () => {
    // Convert annual interest rate to decimal for calculation
    const periodicInterestRate = (interestRate / 100) / getPaymentsPerYear();
    
    // Calculate total number of payments
    const totalPayments = loanTerm * getPaymentsPerYear();
    
    // Calculate monthly payment using formula: PMT = P * r * (1+r)^n / ((1+r)^n - 1)
    const payment = loanAmount * 
                   periodicInterestRate * 
                   Math.pow(1 + periodicInterestRate, totalPayments) / 
                   (Math.pow(1 + periodicInterestRate, totalPayments) - 1);
    
    // Calculate total payment and interest
    const totalPaid = payment * totalPayments;
    const interestPaid = totalPaid - loanAmount;
    
    // Update state with calculations
    setMonthlyPayment(payment);
    setTotalPayment(totalPaid);
    setTotalInterest(interestPaid);
    
    // Generate amortization schedule
    generateAmortizationSchedule(payment, periodicInterestRate, totalPayments);
  };

  // Generate complete amortization schedule
  const generateAmortizationSchedule = (payment, periodicRate, totalPayments) => {
    let balance = loanAmount;
    let schedule = [];
    let date = new Date(startDate);
    
    for (let i = 1; i <= totalPayments; i++) {
      // Calculate interest and principal for this payment
      const interestPayment = balance * periodicRate;
      const principalPayment = payment - interestPayment;
      
      // Update remaining balance
      balance -= principalPayment;
      if (balance < 0) balance = 0;
      
      // Add payment date based on frequency
      if (paymentFrequency === 'monthly') {
        date.setMonth(date.getMonth() + 1);
      } else if (paymentFrequency === 'biweekly') {
        date.setDate(date.getDate() + 14);
      } else if (paymentFrequency === 'weekly') {
        date.setDate(date.getDate() + 7);
      } else if (paymentFrequency === 'quarterly') {
        date.setMonth(date.getMonth() + 3);
      }
      
      schedule.push({
        paymentNumber: i,
        paymentDate: new Date(date).toISOString().split('T')[0],
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }
    
    setAmortizationSchedule(schedule);
  };

  // Calculate comparison loan
  const calculateComparison = () => {
    const periodicInterestRate = (comparisonRate / 100) / getPaymentsPerYear();
    const totalPayments = comparisonTerm * getPaymentsPerYear();
    
    const payment = loanAmount * 
                   periodicInterestRate * 
                   Math.pow(1 + periodicInterestRate, totalPayments) / 
                   (Math.pow(1 + periodicInterestRate, totalPayments) - 1);
    
    const totalPaid = payment * totalPayments;
    const interestPaid = totalPaid - loanAmount;
    
    // Calculate potential savings (could be negative if comparison is worse)
    const savings = totalPayment - totalPaid;
    
    setComparisonResults({
      monthlyPayment: payment,
      totalPayment: totalPaid,
      totalInterest: interestPaid,
      savings: savings
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Loan Calculator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Loan Details</h3>
            
            <div>
              <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">
                Loan Amount (KES)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">KES</span>
                </div>
                <input
                  type="number"
                  id="loanAmount"
                  className="pl-16 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  min="1000"
                  step="1000"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                Annual Interest Rate (%)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="interestRate"
                  className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  min="0.1"
                  max="100"
                  step="0.1"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">
                Loan Term (Years)
              </label>
              <input
                type="number"
                id="loanTerm"
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                min="0.5"
                max="30"
                step="0.5"
              />
            </div>
            
            <div>
              <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700">
                Payment Frequency
              </label>
              <select
                id="paymentFrequency"
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setShowComparison(!showComparison)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showComparison ? 'Hide Comparison' : 'Compare Another Rate'}
              </button>
            </div>
            
            {showComparison && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Comparison Loan</h3>
                
                <div>
                  <label htmlFor="comparisonRate" className="block text-sm font-medium text-gray-700">
                    Comparison Interest Rate (%)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="comparisonRate"
                      className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={comparisonRate}
                      onChange={(e) => setComparisonRate(Number(e.target.value))}
                      min="0.1"
                      max="100"
                      step="0.1"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="comparisonTerm" className="block text-sm font-medium text-gray-700">
                    Comparison Term (Years)
                  </label>
                  <input
                    type="number"
                    id="comparisonTerm"
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={comparisonTerm}
                    onChange={(e) => setComparisonTerm(Number(e.target.value))}
                    min="0.5"
                    max="30"
                    step="0.5"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Summary</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Amount</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(monthlyPayment)}</p>
                  <p className="text-xs text-gray-500">per {paymentFrequency.replace('ly', '')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total of Payments</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalPayment)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total Interest</p>
                  <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalInterest)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Number of Payments</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {loanTerm * getPaymentsPerYear()}
                  </p>
                </div>
              </div>
            </div>
            
            {showComparison && (
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Comparison Results</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Amount</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(comparisonResults.monthlyPayment)}</p>
                    <p className="text-xs text-gray-500">per {paymentFrequency.replace('ly', '')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total of Payments</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(comparisonResults.totalPayment)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total Interest</p>
                    <p className="text-xl font-semibold text-gray-900">{formatCurrency(comparisonResults.totalInterest)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Potential Savings</p>
                    <p className={`text-xl font-semibold ${comparisonResults.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparisonResults.savings > 0 ? `Save ${formatCurrency(comparisonResults.savings)}` : `Costs ${formatCurrency(Math.abs(comparisonResults.savings))} more`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <div className="w-2/3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(loanAmount / totalPayment) * 100}%` }}
                ></div>
              </div>
              <div className="ml-4 text-sm">
                <span className="font-medium text-gray-800">{Math.round((loanAmount / totalPayment) * 100)}%</span> principal / 
                <span className="font-medium text-gray-800"> {Math.round((totalInterest / totalPayment) * 100)}%</span> interest
              </div>
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => setShowSchedule(!showSchedule)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showSchedule ? 'Hide Payment Schedule' : 'View Payment Schedule'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Amortization Schedule */}
        {showSchedule && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Amortization Schedule</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Show only the first 12 payments by default */}
                  {amortizationSchedule.slice(0, 12).map((payment) => (
                    <tr key={payment.paymentNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.payment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.principal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.interest)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-sm text-gray-500 text-center">
                      Showing first 12 payments of {amortizationSchedule.length} total payments.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;