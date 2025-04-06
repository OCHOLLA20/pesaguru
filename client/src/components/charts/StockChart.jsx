import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
  ComposedChart
} from 'recharts';
import { ArrowUp, ArrowDown, Loader } from 'lucide-react';

const StockChart = ({ 
  stockData, 
  symbol, 
  isLoading = false, 
  onTimeRangeChange 
}) => {
  // Default time range is 1 month
  const [timeRange, setTimeRange] = useState('1M');
  
  // Default to showing SMA (Simple Moving Average) indicators
  const [showSMA50, setShowSMA50] = useState(false);
  const [showSMA200, setShowSMA200] = useState(false);
  
  // Default sample data if none provided
  const defaultData = [
    { date: '2024-01-01', price: 150.25, sma50: 148.50, sma200: 142.75, volume: 3245678 },
    { date: '2024-01-02', price: 152.30, sma50: 149.10, sma200: 143.00, volume: 2876543 },
    { date: '2024-01-03', price: 151.80, sma50: 149.25, sma200: 143.25, volume: 3012456 },
    { date: '2024-01-04', price: 153.25, sma50: 149.60, sma200: 143.40, volume: 3456789 },
    { date: '2024-01-05', price: 156.75, sma50: 150.10, sma200: 143.80, volume: 4567890 },
    { date: '2024-01-08', price: 158.30, sma50: 150.75, sma200: 144.10, volume: 3789012 },
    { date: '2024-01-09', price: 157.85, sma50: 151.20, sma200: 144.30, volume: 2987654 },
    { date: '2024-01-10', price: 160.25, sma50: 151.80, sma200: 144.65, volume: 4123567 },
    { date: '2024-01-11', price: 162.40, sma50: 152.30, sma200: 144.90, volume: 5234678 },
    { date: '2024-01-12', price: 161.75, sma50: 152.80, sma200: 145.20, volume: 3456789 },
    { date: '2024-01-15', price: 165.30, sma50: 153.40, sma200: 145.60, volume: 4567890 },
    { date: '2024-01-16', price: 164.85, sma50: 154.00, sma200: 145.95, volume: 3678901 },
    { date: '2024-01-17', price: 167.20, sma50: 154.65, sma200: 146.30, volume: 4789012 },
    { date: '2024-01-18', price: 166.75, sma50: 155.20, sma200: 146.60, volume: 3890123 },
    { date: '2024-01-19', price: 169.30, sma50: 155.85, sma200: 147.00, volume: 5901234 },
    { date: '2024-01-22', price: 170.80, sma50: 156.50, sma200: 147.40, volume: 4012345 },
    { date: '2024-01-23', price: 172.25, sma50: 157.20, sma200: 147.80, volume: 6123456 },
    { date: '2024-01-24', price: 171.50, sma50: 157.80, sma200: 148.15, volume: 4234567 },
    { date: '2024-01-25', price: 174.30, sma50: 158.50, sma200: 148.50, volume: 5345678 },
    { date: '2024-01-26', price: 176.85, sma50: 159.30, sma200: 148.90, volume: 7456789 },
    { date: '2024-01-29', price: 175.30, sma50: 160.00, sma200: 149.25, volume: 4567890 },
    { date: '2024-01-30', price: 178.40, sma50: 160.80, sma200: 149.60, volume: 6678901 },
    { date: '2024-01-31', price: 180.25, sma50: 161.60, sma200: 150.00, volume: 8789012 },
  ];

  // Use provided stock data or default data
  const data = stockData || defaultData;
  
  // Calculate price change and percentage
  const calculatePriceChange = () => {
    if (data.length < 2) return { change: 0, percentage: 0 };
    
    const currentPrice = data[data.length - 1].price;
    const previousPrice = data[0].price;
    const change = currentPrice - previousPrice;
    const percentage = (change / previousPrice) * 100;
    
    return {
      change: change.toFixed(2),
      percentage: percentage.toFixed(2)
    };
  };
  
  const priceChange = calculatePriceChange();
  const isPriceUp = parseFloat(priceChange.change) >= 0;
  
  // Calculate key statistics
  const calculateStats = () => {
    if (data.length === 0) return { high: 0, low: 0, avg: 0, volume: 0 };
    
    const prices = data.map(item => item.price);
    const volumes = data.map(item => item.volume);
    
    return {
      high: Math.max(...prices).toFixed(2),
      low: Math.min(...prices).toFixed(2),
      avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
      volume: (volumes.reduce((a, b) => a + b, 0) / volumes.length).toLocaleString()
    };
  };
  
  const stats = calculateStats();
  
  // Custom date formatter based on time range
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    
    switch(timeRange) {
      case '1D':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
      case '1M':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
  };
  
  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };
  
  // Custom tooltip that shows price, volume, and SMA values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="text-sm font-medium text-gray-900">{new Date(label).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
          <div className="mt-2">
            <p className="text-sm">
              <span className="font-medium">Price: </span>
              <span className="text-gray-900">KES {payload[0].value.toFixed(2)}</span>
            </p>
            
            {showSMA50 && payload[1] && (
              <p className="text-sm">
                <span className="font-medium">SMA50: </span>
                <span className="text-blue-600">KES {payload[1].value.toFixed(2)}</span>
              </p>
            )}
            
            {showSMA200 && payload[2] && (
              <p className="text-sm">
                <span className="font-medium">SMA200: </span>
                <span className="text-purple-600">KES {payload[2].value.toFixed(2)}</span>
              </p>
            )}
            
            <p className="text-sm mt-1">
              <span className="font-medium">Volume: </span>
              <span className="text-gray-700">{payload[0].payload.volume.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header with stock info and price change */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{symbol || 'SCOM'}</h3>
          <p className="text-sm text-gray-500">Nairobi Securities Exchange</p>
        </div>
        
        <div className="mt-2 sm:mt-0">
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">
              KES {data.length ? data[data.length - 1].price.toFixed(2) : '0.00'}
            </span>
            <div className={`flex items-center ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
              {isPriceUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-medium ml-1">
                {isPriceUp ? '+' : ''}{priceChange.change} ({isPriceUp ? '+' : ''}{priceChange.percentage}%)
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {data.length ? new Date(data[data.length - 1].date).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>
      
      {/* Time range selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
          <button
            key={range}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              timeRange === range 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => handleTimeRangeChange(range)}
          >
            {range}
          </button>
        ))}
      </div>
      
      {/* Chart indicators toggles */}
      <div className="flex gap-4 mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={showSMA50}
            onChange={() => setShowSMA50(!showSMA50)}
          />
          <span className="ml-2 text-sm text-gray-700">SMA 50</span>
        </label>
        
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-purple-600"
            checked={showSMA200}
            onChange={() => setShowSMA200(!showSMA200)}
          />
          <span className="ml-2 text-sm text-gray-700">SMA 200</span>
        </label>
      </div>
      
      {/* Main chart */}
      <div className="h-64 md:h-80">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader size={32} className="text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-500">Loading chart data...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(value) => `${value}`}
                width={40}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#colorPrice)" 
                activeDot={{ r: 6 }} 
              />
              
              {showSMA50 && (
                <Line 
                  type="monotone" 
                  dataKey="sma50" 
                  stroke="#2563eb" 
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              )}
              
              {showSMA200 && (
                <Line 
                  type="monotone" 
                  dataKey="sma200" 
                  stroke="#7c3aed" 
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">High</p>
          <p className="text-lg font-semibold text-gray-900">KES {stats.high}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Low</p>
          <p className="text-lg font-semibold text-gray-900">KES {stats.low}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Avg. Price</p>
          <p className="text-lg font-semibold text-gray-900">KES {stats.avg}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Avg. Volume</p>
          <p className="text-lg font-semibold text-gray-900">{stats.volume}</p>
        </div>
      </div>
    </div>
  );
};

export default StockChart;