import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector
} from 'recharts';

/**
 * PortfolioAllocationChart - Displays the allocation of assets in a portfolio
 * 
 * @param {Object} props
 * @param {Array} props.data - Allocation data to display [{ category, value, color }]
 * @param {string} props.title - Chart title
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.showLegend - Whether to show the legend
 * @param {string} props.emptyStateMessage - Message to show when no data is available
 */
const PortfolioAllocationChart = ({
  data = [],
  title = "Portfolio Allocation",
  isLoading = false,
  showLegend = true,
  emptyStateMessage = "No allocation data available"
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // If colors aren't provided, use these defaults
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F43F5E', '#6366F1', '#84CC16'];

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { category, value, color } = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: color }}
            ></div>
            <p className="font-medium text-gray-700">{category}</p>
          </div>
          <p className="text-sm mt-1">
            <span className="font-bold" style={{ color }}>
              {formatPercentage(value)}
            </span> of portfolio
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const renderCustomizedLegend = (props) => {
    const { payload } = props;

    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center cursor-pointer"
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className={`text-sm ${activeIndex === index ? 'font-bold' : ''}`}>
              {entry.value}: {formatPercentage(entry.payload.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Animated sector for active segment
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Handle mouse events for pie chart
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 w-40 bg-gray-100 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">{emptyStateMessage}</p>
          <p className="text-sm text-gray-400">Add investments to see your portfolio allocation</p>
        </div>
      </div>
    );
  }

  // Ensure each data item has a color
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  // Calculate total for reference
  const total = dataWithColors.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithColors}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={1}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend content={renderCustomizedLegend} />}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Top Allocation</p>
          <p className="text-lg font-semibold">
            {dataWithColors.length ? dataWithColors.sort((a, b) => b.value - a.value)[0].category : '-'}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Categories</p>
          <p className="text-lg font-semibold">
            {dataWithColors.length || '-'}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Most Diverse</p>
          <p className="text-lg font-semibold">
            {dataWithColors.length >= 3 ? 'Yes' : 'No'}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Risk Profile</p>
          <p className="text-lg font-semibold">
            {(() => {
              // Simple risk assessment based on allocation
              const stocksPercentage = dataWithColors.find(item => 
                item.category.toLowerCase().includes('stock'))?.value || 0;
              
              if (stocksPercentage > 70) return 'Aggressive';
              if (stocksPercentage > 40) return 'Moderate';
              return 'Conservative';
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAllocationChart;