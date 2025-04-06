import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import useInvestments from '../../hooks/useInvestments';

const PortfolioAllocation = () => {
  const { portfolio, isLoading, error, fetchPortfolio } = useInvestments();
  const [activeIndex, setActiveIndex] = useState(null);

  // Color palette for different asset classes
  const COLORS = [
    '#0088FE', // Blue - Stocks
    '#00C49F', // Green - Bonds
    '#FFBB28', // Yellow - Cash
    '#FF8042', // Orange - Real Estate
    '#8884D8', // Purple - Commodities
    '#82CA9D', // Light Green - Alternative Investments
    '#D0ED57', // Lime - Fixed Income
    '#F06292', // Pink - International Equity
  ];

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Fetch portfolio data when component mounts
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  // Handle mouse enter on pie slices
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Handle mouse leave on pie slices
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom active shape for pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    return (
      <g>
        <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#333" className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#999" className="text-xs">
          {formatPercentage(percent * 100)}
        </text>
        <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#666" className="text-xs">
          {formatCurrency(value)}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 1}
          fill={fill}
        />
      </g>
    );
  };

  // Format tooltip content
  const renderTooltipContent = (props) => {
    const { payload } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">{formatPercentage(data.percent * 100)}</p>
          <p className="text-sm font-medium text-blue-600">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Allocation</h2>
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Allocation</h2>
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p>Failed to load portfolio data. Please try again later.</p>
          <button 
            onClick={fetchPortfolio} 
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md text-sm font-medium text-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty portfolio state
  if (!portfolio || !portfolio.allocation || portfolio.allocation.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Allocation</h2>
        <div className="bg-blue-50 p-6 rounded-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-center mb-4">
            You don't have any investments in your portfolio yet.
          </p>
          <button 
            onClick={() => window.location.href = '/investments/recommendations'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Get Investment Recommendations
          </button>
        </div>
      </div>
    );
  }

  // Calculate total portfolio value
  const totalValue = portfolio.allocation.reduce((sum, item) => sum + item.value, 0);

  // Calculate percentages for each allocation item
  const chartData = portfolio.allocation.map(item => ({
    ...item,
    percent: (item.value / totalValue) * 100
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Portfolio Allocation</h2>
        <div className="mt-2 md:mt-0">
          <span className="text-sm text-gray-600">Total Value: </span>
          <span className="text-md font-semibold text-gray-800">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltipContent} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                  formatter={(value) => <span className="text-sm text-gray-700">{value}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown table */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Asset Allocation</h3>
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-gray-800">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{formatPercentage(item.percent)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${item.percent}%`, 
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk assessment */}
          {portfolio.riskScore && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Risk Assessment</h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        portfolio.riskScore < 30 ? 'bg-green-500' : 
                        portfolio.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${portfolio.riskScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Conservative</span>
                    <span>Moderate</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="text-lg font-semibold">{portfolio.riskScore}</span>
                  <span className="text-sm text-gray-500">/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rebalance recommendation section (conditionally rendered) */}
      {portfolio.rebalanceRecommended && (
        <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 012 0v2a1 1 0 11-2 0v-2zm0-6a1 1 0 112 0v2a1 1 0 11-2 0V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Portfolio Rebalance Recommended</h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>Your portfolio allocation has drifted from your target allocation. Consider rebalancing to maintain your desired risk level.</p>
              </div>
              <div className="mt-3">
                <a
                  href="/portfolio/rebalance"
                  className="text-sm font-medium text-yellow-800 hover:text-yellow-700"
                >
                  View Rebalance Options →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAllocation;