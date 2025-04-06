import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useInvestments } from '../../hooks/useInvestments';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Briefcase, CreditCard, PiggyBank, TrendingUp } from 'lucide-react';

// Sample data - in a real app, this would come from the API
const samplePortfolioData = [
  { month: 'Jan', value: 15000 },
  { month: 'Feb', value: 16200 },
  { month: 'Mar', value: 15800 },
  { month: 'Apr', value: 16500 },
  { month: 'May', value: 17200 },
  { month: 'Jun', value: 18000 },
  { month: 'Jul', value: 19500 },
  { month: 'Aug', value: 20100 },
  { month: 'Sep', value: 21000 },
  { month: 'Oct', value: 22300 },
  { month: 'Nov', value: 23100 },
  { month: 'Dec', value: 24500 },
];

const sampleAllocationData = [
  { name: 'Stocks', value: 55, color: '#1E40AF' },
  { name: 'Bonds', value: 25, color: '#0EA5E9' },
  { name: 'Cash', value: 15, color: '#10B981' },
  { name: 'Real Estate', value: 5, color: '#F59E0B' },
];

const COLORS = ['#1E40AF', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

const FinancialOverview = () => {
  const { userProfile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { portfolio, isLoading: portfolioLoading, error: portfolioError } = useInvestments();
  
  const [timeRange, setTimeRange] = useState('1y'); // '1m', '3m', '6m', '1y', 'all'
  
  // Combine loading states
  const isLoading = profileLoading || portfolioLoading;
  const error = profileError || portfolioError;

  // Format currency helper function
  const formatCurrency = (value, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  // In a real app, you would use the actual data from the API
  // Here I'm using sample data for demonstration
  const financialData = {
    netWorth: 1235000, // KES
    totalAssets: 1500000,
    totalLiabilities: 265000,
    cashBalance: 250000,
    investments: 1250000,
    monthlyIncome: 150000,
    monthlyExpenses: 100000,
    savingsRate: 33, // percentage
    allocationData: sampleAllocationData,
    portfolioData: samplePortfolioData,
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Financial Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Net Worth"
          value={formatCurrency(financialData.netWorth)}
          icon={<DollarSign className="h-5 w-5 text-blue-600" />}
          trend="up"
          percentage="8.5"
        />
        <SummaryCard 
          title="Total Assets"
          value={formatCurrency(financialData.totalAssets)}
          icon={<Briefcase className="h-5 w-5 text-green-600" />}
          trend="up"
          percentage="5.2"
        />
        <SummaryCard 
          title="Total Liabilities"
          value={formatCurrency(financialData.totalLiabilities)}
          icon={<CreditCard className="h-5 w-5 text-red-600" />}
          trend="down"
          percentage="3.1"
          invertTrend={true}
        />
        <SummaryCard 
          title="Cash Balance"
          value={formatCurrency(financialData.cashBalance)}
          icon={<PiggyBank className="h-5 w-5 text-amber-600" />}
          trend="up"
          percentage="2.8"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Portfolio Growth Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Portfolio Growth</h2>
            <div className="inline-flex rounded-md shadow-sm">
              <TimeRangeSelector 
                currentRange={timeRange}
                onRangeChange={setTimeRange}
              />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={financialData.portfolioData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Value']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1E40AF" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: '#1E40AF', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Asset Allocation Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Asset Allocation</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {financialData.allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Allocation']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Income & Expenses Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Income & Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            title="Monthly Income"
            value={formatCurrency(financialData.monthlyIncome)}
            icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          />
          <InfoCard
            title="Monthly Expenses"
            value={formatCurrency(financialData.monthlyExpenses)}
            icon={<ArrowDownCircle className="h-5 w-5 text-red-600" />}
          />
          <InfoCard
            title="Savings Rate"
            value={`${financialData.savingsRate}%`}
            icon={<PiggyBank className="h-5 w-5 text-blue-600" />}
          />
        </div>
        
        {/* Progress bar for savings */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-700">Savings Target: 40%</h3>
            <span className="text-sm font-medium text-gray-700">{financialData.savingsRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${financialData.savingsRate}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Financial Health Score */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Health Score</h2>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <svg className="w-36 h-36" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1E40AF"
                  strokeWidth="3"
                  strokeDasharray="75, 100"
                />
                <text x="18" y="20.5" textAnchor="middle" fill="#1E40AF" fontSize="10px" fontWeight="bold">75/100</text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-800">75</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Your financial health is good</p>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-800 mb-2">Recommendations:</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800">
                  1
                </span>
              </div>
              <p className="ml-3 text-sm text-gray-600">Consider increasing your emergency fund to cover 6 months of expenses.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800">
                  2
                </span>
              </div>
              <p className="ml-3 text-sm text-gray-600">Diversify your investment portfolio by adding more bond allocations.</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800">
                  3
                </span>
              </div>
              <p className="ml-3 text-sm text-gray-600">Review your insurance coverage to ensure adequate protection.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper Components

const SummaryCard = ({ title, value, icon, trend, percentage, invertTrend = false }) => {
  const trendColor = (trend === 'up' && !invertTrend) || (trend === 'down' && invertTrend) ? 'text-green-600' : 'text-red-600';
  const trendIcon = (trend === 'up' && !invertTrend) || (trend === 'down' && invertTrend) 
    ? <ArrowUpCircle className={`h-5 w-5 ${trendColor}`} /> 
    : <ArrowDownCircle className={`h-5 w-5 ${trendColor}`} />;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between">
        <div className="flex space-x-2 items-center">
          {icon}
          <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        </div>
        <div className="flex items-center space-x-1">
          {trendIcon}
          <span className={`text-xs ${trendColor}`}>{percentage}%</span>
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

const InfoCard = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
};

const TimeRangeSelector = ({ currentRange, onRangeChange }) => {
  const ranges = [
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: 'All', value: 'all' },
  ];
  
  return (
    <div className="inline-flex rounded-md shadow-sm">
      {ranges.map((range) => (
        <button
          key={range.value}
          type="button"
          className={`relative inline-flex items-center px-3 py-1 text-sm font-medium ${
            currentRange === range.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } ${range.value === '1m' ? 'rounded-l-md' : ''} ${
            range.value === 'all' ? 'rounded-r-md' : ''
          } border border-gray-300`}
          onClick={() => onRangeChange(range.value)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md h-24">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md h-72">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md h-72">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ message }) => {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading financial data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{message || "Something went wrong. Please try again later."}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;