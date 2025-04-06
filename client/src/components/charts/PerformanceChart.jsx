import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar
} from 'recharts';

/**
 * PerformanceChart - Displays investment performance over time
 * 
 * @param {Object} props
 * @param {Array} props.data - Performance data to display
 * @param {string} props.title - Chart title
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.showComparison - Whether to show comparison data (e.g., benchmark)
 * @param {boolean} props.showBarChart - Whether to show additional bar chart for monthly gains/losses
 * @param {Function} props.onPeriodChange - Callback when time period is changed
 */
const PerformanceChart = ({
  data = [],
  title = "Investment Performance",
  isLoading = false,
  showComparison = false,
  showBarChart = false,
  onPeriodChange = () => {}
}) => {
  const [period, setPeriod] = useState('1y');
  const [chartData, setChartData] = useState([]);

  // Time period options
  const periodOptions = [
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'All' }
  ];

  // Format currency
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return `KES ${value.toLocaleString()}`;
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '-';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between mt-1">
              <span className="mr-4" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="font-medium">
                {entry.name.includes('Return') 
                  ? formatPercentage(entry.value) 
                  : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    onPeriodChange(newPeriod);
  };

  // Filter data based on selected period
  useEffect(() => {
    if (data.length === 0) return;

    // Filter data based on period
    let filteredData = [...data];
    
    // In a real app, you'd filter based on the period
    // Here we'll just use the full dataset for demonstration
    
    setChartData(filteredData);
  }, [data, period]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No performance data available</p>
          <p className="text-sm text-gray-400">Data will appear once you make investments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex space-x-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePeriodChange(option.value)}
              className={`px-2 py-1 text-xs rounded ${
                period === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {showBarChart ? (
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatCurrency}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatPercentage}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="value" 
                fill="#3B82F6" 
                stroke="#1D4ED8" 
                name="Portfolio Value"
                fillOpacity={0.3}
              />
              <Bar 
                yAxisId="right"
                dataKey="monthlyReturn" 
                name="Monthly Return" 
                fill={(entry) => (entry.monthlyReturn >= 0 ? '#10B981' : '#EF4444')}
              />
              {showComparison && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="benchmarkReturn" 
                  stroke="#6366F1" 
                  name="Benchmark Return"
                  strokeWidth={2}
                />
              )}
            </ComposedChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                name="Portfolio Value"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              {showComparison && (
                <Line 
                  type="monotone" 
                  dataKey="benchmarkValue" 
                  stroke="#6366F1" 
                  name="Benchmark"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Current Value</p>
          <p className="text-lg font-semibold">
            {chartData.length ? formatCurrency(chartData[chartData.length - 1].value) : '-'}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Overall Return</p>
          <p className={`text-lg font-semibold ${chartData.length && chartData[chartData.length - 1].overallReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {chartData.length ? formatPercentage(chartData[chartData.length - 1].overallReturn) : '-'}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Highest Value</p>
          <p className="text-lg font-semibold">
            {chartData.length ? formatCurrency(Math.max(...chartData.map(item => item.value))) : '-'}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Starting Value</p>
          <p className="text-lg font-semibold">
            {chartData.length ? formatCurrency(chartData[0].value) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;