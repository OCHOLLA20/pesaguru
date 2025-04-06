import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { formatCurrency } from '../../utils/formatters';

// Transaction status badge component
const StatusBadge = ({ status }) => {
  const statusClasses = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

// Transaction type icon component
const TransactionIcon = ({ type }) => {
  const iconMap = {
    deposit: (
      <div className="p-2 bg-green-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    withdrawal: (
      <div className="p-2 bg-red-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    transfer: (
      <div className="p-2 bg-blue-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
        </svg>
      </div>
    ),
    payment: (
      <div className="p-2 bg-purple-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    investment: (
      <div className="p-2 bg-indigo-100 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      </div>
    )
  };
  
  return iconMap[type.toLowerCase()] || (
    <div className="p-2 bg-gray-100 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

// Example fallback data for when API is not available
const fallbackData = [
  {
    id: "t1",
    date: "2025-04-05T09:35:24Z",
    description: "Safaricom Ltd Stock Purchase",
    amount: -15000,
    type: "investment",
    status: "completed",
    account: "Investment Portfolio"
  },
  {
    id: "t2",
    date: "2025-04-04T14:22:15Z",
    description: "Salary Deposit",
    amount: 75000,
    type: "deposit",
    status: "completed",
    account: "M-Pesa"
  },
  {
    id: "t3",
    date: "2025-04-03T16:48:33Z",
    description: "KCB Bond Investment",
    amount: -25000,
    type: "investment",
    status: "pending",
    account: "Investment Portfolio"
  },
  {
    id: "t4",
    date: "2025-04-01T11:15:42Z",
    description: "Utility Bill Payment",
    amount: -5500,
    type: "payment",
    status: "completed",
    account: "M-Pesa"
  },
  {
    id: "t5",
    date: "2025-03-30T08:30:21Z",
    description: "Dividend Income",
    amount: 3200,
    type: "deposit",
    status: "completed",
    account: "Investment Portfolio"
  }
];

const RecentTransactions = ({ limit = 5 }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    // Simulate API call to get transactions
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch data from your API
        // const response = await fetch('/api/transactions');
        // const data = await response.json();
        
        // Using fallback data for now
        setTimeout(() => {
          setTransactions(fallbackData);
          setIsLoading(false);
        }, 800); // Simulate network delay
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setTransactions([]);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userProfile]);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-KE', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="space-y-3">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-2 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render empty state
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No transactions found</p>
        </div>
      </div>
    );
  }

  // Render transactions
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-2">
        {transactions.slice(0, limit).map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
            <TransactionIcon type={transaction.type} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{transaction.description}</p>
              <p className="text-xs text-gray-500">{formatDate(transaction.date)} • {transaction.account}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(transaction.amount, 'KES')}
              </p>
              <div className="mt-1">
                <StatusBadge status={transaction.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;