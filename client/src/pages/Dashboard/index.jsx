import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const mockUserData = {
  name: "Sharon Bukaya",
  totalAssets: 3250000,
  totalLiabilities: 850000,
  cashBalance: 450000,
  lastLogin: "2025-04-05T14:30:00Z",
  riskProfile: "moderate"
};

const mockPortfolioData = {
  allocation: [
    { category: "Stocks", percentage: 45, value: 1080000, color: "#4F46E5" },
    { category: "Bonds", percentage: 25, value: 600000, color: "#10B981" },
    { category: "Real Estate", percentage: 15, value: 360000, color: "#F59E0B" },
    { category: "Cash", percentage: 10, value: 240000, color: "#3B82F6" },
    { category: "Commodities", percentage: 5, value: 120000, color: "#EC4899" }
  ],
  monthlyGrowth: 3.2,
  yearlyGrowth: 12.8
};

const mockTransactions = [
  { id: 1, description: "Deposit to Money Market Fund", amount: 15000, type: "deposit", date: "2025-04-03T10:15:00Z" },
  { id: 2, description: "Stock Purchase - Safaricom", amount: 25000, type: "investment", date: "2025-04-02T14:30:00Z" },
  { id: 3, description: "Withdrawal for Home Renovation", amount: 50000, type: "withdrawal", date: "2025-03-28T16:45:00Z" },
  { id: 4, description: "Dividend Payment", amount: 3200, type: "income", date: "2025-03-25T09:20:00Z" },
  { id: 5, description: "Loan Payment", amount: 18500, type: "expense", date: "2025-03-20T11:30:00Z" }
];

const mockGoals = [
  { id: 1, name: "Buy a Home", targetAmount: 2000000, currentAmount: 800000, targetDate: "2026-12-31", category: "housing" },
  { id: 2, name: "Emergency Fund", targetAmount: 300000, currentAmount: 150000, targetDate: "2025-06-30", category: "savings" },
  { id: 3, name: "Retirement", targetAmount: 5000000, currentAmount: 1000000, targetDate: "2040-01-01", category: "retirement" }
];

const mockMarketData = {
  indices: [
    { name: "NSE 20", value: 1982.57, change: 15.23, changePercent: 0.77 },
    { name: "NASI", value: 156.32, change: -2.41, changePercent: -1.52 },
    { name: "NSE 25", value: 3763.21, change: 22.16, changePercent: 0.59 }
  ],
  topMovers: [
    { symbol: "SCOM", name: "Safaricom", price: 37.65, changePercent: 2.18, volume: 3500000 },
    { symbol: "EQTY", name: "Equity Group", price: 42.25, changePercent: 1.32, volume: 1200000 },
    { symbol: "KCB", name: "KCB Group", price: 39.10, changePercent: -1.88, volume: 980000 }
  ],
  currencies: [
    { pair: "USD/KES", rate: 127.85, changePercent: -0.35 },
    { pair: "GBP/KES", rate: 165.42, changePercent: 0.41 },
    { pair: "EUR/KES", rate: 138.77, changePercent: -0.12 }
  ]
};

const mockNotifications = [
  { id: 1, type: "alert", message: "Your emergency fund goal is 85% complete", date: "2025-04-06T08:15:00Z", isRead: false },
  { id: 2, type: "tip", message: "Consider rebalancing your portfolio based on recent market movements", date: "2025-04-05T14:30:00Z", isRead: false },
  { id: 3, type: "update", message: "NSE market report for Q1 2025 is now available", date: "2025-04-04T11:20:00Z", isRead: true }
];

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading your dashboard...</span>
  </div>
);

// Portfolio Allocation Chart component
const PortfolioAllocationChart = ({ allocation }) => {
  // Calculate starting position for each segment
  let currentOffset = 0;
  
  return (
    <div className="flex justify-center items-center h-52">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {allocation.map((item, index) => {
            const startAngle = currentOffset;
            const sliceAngle = (item.percentage / 100) * 360;
            currentOffset += sliceAngle;
            
            // Convert angles to radians and calculate arc path
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (startAngle + sliceAngle - 90) * Math.PI / 180;
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            // Determine if the slice is large or small
            const largeArcFlag = sliceAngle > 180 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');
            
            return (
              <path 
                key={index}
                d={pathData}
                fill={item.color} 
                stroke="#fff" 
                strokeWidth="1"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
      
      <div className="ml-6 flex flex-col space-y-2">
        {allocation.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="h-3 w-3 rounded-sm mr-2" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm">{item.category} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Transaction item component
const TransactionItem = ({ transaction }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
  };
  
  // Transaction type styles and icons
  const typeConfig = {
    deposit: { 
      textColor: 'text-green-600', 
      bgColor: 'bg-green-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      )
    },
    withdrawal: { 
      textColor: 'text-red-600', 
      bgColor: 'bg-red-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      )
    },
    investment: { 
      textColor: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    },
    income: { 
      textColor: 'text-emerald-600', 
      bgColor: 'bg-emerald-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    expense: { 
      textColor: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      )
    }
  };
  
  const { textColor, bgColor, icon } = typeConfig[transaction.type] || typeConfig.expense;
  
  return (
    <div className="flex items-center py-3 border-b border-gray-100">
      <div className={`p-2 rounded-full mr-3 ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium">{transaction.description}</p>
        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
      </div>
      <div className={`text-right ${transaction.type === 'deposit' || transaction.type === 'income' ? 'text-green-600' : ''}`}>
        <p className="text-sm font-medium">
          {(transaction.type === 'deposit' || transaction.type === 'income') ? '+' : ''}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
};

// Goal progress component
const GoalProgressMini = ({ goal }) => {
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };
  
  // Calculate time remaining
  const calculateTimeRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = Math.abs(target - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };
  
  // Category colors
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
    <div className="py-3 border-b border-gray-100">
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center">
          <span className="font-medium text-sm">{goal.name}</span>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${categoryColors[goal.category]}`}>
            {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
          </span>
        </div>
        <span className="text-xs text-gray-500">{calculateTimeRemaining(goal.targetDate)} left</span>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
        <span>{formatCurrency(goal.currentAmount)}</span>
        <span>{formatCurrency(goal.targetAmount)}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-blue-600 h-1.5 rounded-full" 
          style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Market data component
const MarketOverview = ({ data }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Market Indices</h3>
        <div className="grid grid-cols-3 gap-2">
          {data.indices.map((index, i) => (
            <div key={i} className="bg-white p-2 rounded-lg shadow-sm">
              <div className="font-medium text-sm">{index.name}</div>
              <div className="text-sm">{index.value.toLocaleString()}</div>
              <div className={`text-xs ${index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Top Movers</h3>
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topMovers.map((stock, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium text-sm">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {stock.price.toFixed(2)}
                  </td>
                  <td className={`px-3 py-2 whitespace-nowrap text-sm text-right ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Exchange Rates</h3>
        <div className="grid grid-cols-3 gap-2">
          {data.currencies.map((currency, i) => (
            <div key={i} className="bg-white p-2 rounded-lg shadow-sm">
              <div className="font-medium text-sm">{currency.pair}</div>
              <div className="text-sm">{currency.rate.toFixed(2)}</div>
              <div className={`text-xs ${currency.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currency.changePercent >= 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Notification item component
const NotificationItem = ({ notification }) => {
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hr ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} day ago`;
    
    return date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
  };
  
  // Type config for icons and colors
  const typeConfig = {
    alert: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: 'text-orange-500 bg-orange-100'
    },
    tip: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      color: 'text-blue-500 bg-blue-100'
    },
    update: {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: 'text-green-500 bg-green-100'
    }
  };
  
  const { icon, color } = typeConfig[notification.type] || typeConfig.update;
  
  return (
    <div className={`flex py-3 ${notification.isRead ? 'opacity-60' : ''}`}>
      <div className={`p-2 rounded-full mr-3 ${color}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-gray-500">{formatRelativeTime(notification.date)}</p>
      </div>
      {!notification.isRead && (
        <div className="w-2 h-2 bg-blue-600 rounded-full self-start mt-2"></div>
      )}
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  
  // Simulate API calls to get data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Set data from mock sources
        setUserData(mockUserData);
        setPortfolioData(mockPortfolioData);
        setTransactions(mockTransactions);
        setGoals(mockGoals);
        setMarketData(mockMarketData);
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Calculate net worth
  const netWorth = userData.totalAssets - userData.totalLiabilities;
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {userData.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-gray-600">
          Here's your financial overview as of {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      {/* Financial summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Net Worth */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-600">Net Worth</h2>
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency(netWorth)}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className={`${netWorth >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {formatPercentage(3.5)}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        
        {/* Total Assets */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-600">Total Assets</h2>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency(userData.totalAssets)}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 font-medium">
              {formatPercentage(2.8)}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        
        {/* Total Liabilities */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-600">Total Liabilities</h2>
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency(userData.totalLiabilities)}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 font-medium">
              {formatPercentage(-1.2)}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        
        {/* Cash Balance */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-600">Cash Balance</h2>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-2xl font-semibold text-gray-800">
            {formatCurrency(userData.cashBalance)}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 font-medium">
              {formatPercentage(5.3)}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio allocation */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Portfolio Allocation</h2>
              <Link to="/dashboard/portfolio" className="text-sm text-blue-600 hover:text-blue-800">
                View Details
              </Link>
            </div>
            <PortfolioAllocationChart allocation={portfolioData.allocation} />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-600">Monthly Growth</p>
                <p className={`text-lg font-medium ${portfolioData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(portfolioData.monthlyGrowth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Yearly Growth</p>
                <p className={`text-lg font-medium ${portfolioData.yearlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(portfolioData.yearlyGrowth)}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-colors">
                Invest More
              </button>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              <Link to="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
            <div className="space-y-1">
              {transactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
          
          {/* Market Overview */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Market Overview</h2>
              <Link to="/market" className="text-sm text-blue-600 hover:text-blue-800">
                View Market
              </Link>
            </div>
            <MarketOverview data={marketData} />
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Financial Goals */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Financial Goals</h2>
              <Link to="/dashboard/goals" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
            <div>
              {goals.map(goal => (
                <GoalProgressMini key={goal.id} goal={goal} />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link to="/dashboard/goals"
                className="w-full flex justify-center items-center text-blue-600 hover:text-blue-800 py-2 rounded border border-blue-200 hover:border-blue-400 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Goal
              </Link>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Mark All as Read
              </button>
            </div>
            <div className="space-y-1">
              {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">Add Funds</span>
              </button>
              <button className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                <span className="text-sm">Invest</span>
              </button>
              <button className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span className="text-sm">Loan</span>
              </button>
              <button className="p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;