import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Info, DollarSign, BarChart2 } from 'lucide-react';

// This would normally be imported from your API service
import { getStockDetails } from '../../api/investment';
import { useAuth } from '../../context/AuthContext';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

const StockDetails = () => {
  const { symbol } = useParams();
  const { user } = useAuth();
  const [stock, setStock] = useState(null);
  const [period, setPeriod] = useState('1m');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, this would be an API call
        // const data = await getStockDetails(symbol, period);
        
        // Mock data for development
        const data = {
          symbol: symbol,
          name: `${symbol} Stock`,
          currentPrice: 235.75,
          currency: "KES",
          change: 4.25,
          changePercent: 1.83,
          marketCap: "45.8B",
          volume: "3.2M",
          pe: 15.4,
          dividend: 2.5,
          sector: "Technology",
          riskLevel: "Moderate",
          recommendation: "Buy",
          matchScore: 85,
          historicalPrices: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            price: 200 + Math.random() * 50
          })),
          analysis: {
            strengths: ["Strong market position", "Growing revenue", "High dividend yield"],
            weaknesses: ["Competitive industry", "Regulatory challenges"],
            outlook: "Positive growth expected in the next 3-6 months based on industry trends."
          }
        };
        
        setStock(data);
      } catch (err) {
        console.error('Failed to fetch stock details:', err);
        setError('Unable to load stock information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockDetails();
  }, [symbol, period]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner label="Loading stock data..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorAlert message={error} />;
  }

  // Empty state
  if (!stock) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No stock data</h3>
        <p className="mt-1 text-sm text-gray-500">We couldn't find data for this stock.</p>
        <div className="mt-6">
          <Link to="/investments" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Back to Investments
          </Link>
        </div>
      </div>
    );
  }

  const isPositiveChange = stock.change >= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/investments" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Investments
      </Link>

      {/* Header with basic stock info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{stock.name} ({stock.symbol})</h1>
            <p className="text-gray-500">{stock.sector}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold">{stock.currency} {stock.currentPrice.toFixed(2)}</div>
            <div className={`flex items-center ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveChange ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
              <span className="font-semibold">
                {isPositiveChange ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price chart */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Price History</h2>
          <div className="flex space-x-2">
            {['1w', '1m', '3m', '6m', '1y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-md ${
                  period === p 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stock.historicalPrices}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                formatter={(value) => [`${stock.currency} ${value.toFixed(2)}`, 'Price']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock metrics and recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Key metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Market Cap</span>
              <span className="font-medium">{stock.marketCap}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Volume</span>
              <span className="font-medium">{stock.volume}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">P/E Ratio</span>
              <span className="font-medium">{stock.pe}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Dividend Yield</span>
              <span className="font-medium">{stock.dividend}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Sector</span>
              <span className="font-medium">{stock.sector}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Risk Level</span>
              <span className="font-medium">{stock.riskLevel}</span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">PesaGuru Recommendation</h2>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold">{stock.recommendation}</div>
              <div className={`text-sm px-2 py-1 rounded-full ${
                stock.recommendation === 'Buy' 
                  ? 'bg-green-100 text-green-800' 
                  : stock.recommendation === 'Sell' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {stock.matchScore}% match for your profile
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Analysis</h3>
            
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider">Strengths</h4>
              <ul className="mt-1 text-sm text-gray-700 pl-5 list-disc">
                {stock.analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider">Considerations</h4>
              <ul className="mt-1 text-sm text-gray-700 pl-5 list-disc">
                {stock.analysis.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider">Outlook</h4>
              <p className="mt-1 text-sm text-gray-700">{stock.analysis.outlook}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center shadow-sm">
          <DollarSign className="w-5 h-5 mr-2" />
          Add to Portfolio
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center shadow-sm">
          <BarChart2 className="w-5 h-5 mr-2" />
          Compare Stocks
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center shadow-sm">
          <Info className="w-5 h-5 mr-2" />
          Learn More
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          Set Price Alert
        </button>
      </div>

      {/* Ask chatbot prompt */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <p className="text-blue-700">
          Want to know more about this stock or how it fits in your portfolio?
        </p>
        <Link 
          to="/chatbot" 
          className="bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-md hover:bg-blue-50"
        >
          Ask PesaGuru
        </Link>
      </div>
    </div>
  );
};

export default StockDetails;