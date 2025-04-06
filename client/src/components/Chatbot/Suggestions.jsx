import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Wallet, DollarSign, Search, BarChart2, HelpCircle } from 'lucide-react';

const Suggestions = ({ onSuggestionClick, isDisabled = false }) => {
  const [expandedCategory, setExpandedCategory] = useState('investments');
  
  // Predefined suggestion categories with their respective suggestions
  const suggestionCategories = [
    {
      id: 'investments',
      name: 'Investments',
      icon: <TrendingUp size={16} />,
      suggestions: [
        'What stocks should I invest in?',
        'How do I start investing in the NSE?',
        'Compare stocks and treasury bonds',
        'What are the best performing stocks this year?',
        'Explain mutual funds in Kenya'
      ]
    },
    {
      id: 'budgeting',
      name: 'Budgeting',
      icon: <Wallet size={16} />,
      suggestions: [
        'Help me create a monthly budget',
        'How much should I save each month?',
        'Tips to reduce my expenses',
        'How to track my spending better?',
        'How to budget for unexpected expenses'
      ]
    },
    {
      id: 'loans',
      name: 'Loans & Credit',
      icon: <DollarSign size={16} />,
      suggestions: [
        'Compare loan options from Kenyan banks',
        'How to improve my credit score',
        'What loan amount can I afford?',
        'Should I consolidate my loans?',
        'Compare mortgage rates'
      ]
    },
    {
      id: 'market',
      name: 'Market Analysis',
      icon: <BarChart2 size={16} />,
      suggestions: [
        'How is the NSE performing today?',
        'Latest Treasury bond rates',
        'Current M-Pesa transaction costs',
        'What sectors are trending this month?',
        'Currency exchange rate forecast'
      ]
    },
    {
      id: 'general',
      name: 'General Help',
      icon: <HelpCircle size={16} />,
      suggestions: [
        'What can you help me with?',
        'Explain financial terms',
        'How do you calculate my risk profile?',
        'How secure is my financial data?',
        'Show me investment opportunities under 10,000 KES'
      ]
    }
  ];

  // Toggle expanded category
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (!isDisabled && onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-4">
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center text-gray-700">
          <Search size={16} className="mr-2" />
          <h3 className="text-sm font-medium">Suggested Questions</h3>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {suggestionCategories.map((category) => (
          <div key={category.id} className="bg-white">
            {/* Category header - clickable */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-60"
              disabled={isDisabled}
              aria-expanded={expandedCategory === category.id}
              aria-controls={`category-${category.id}-suggestions`}
            >
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">{category.icon}</span>
                <span className="text-sm font-medium text-gray-800">{category.name}</span>
              </div>
              {expandedCategory === category.id ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>
            
            {/* Suggestions list - conditionally shown */}
            {expandedCategory === category.id && (
              <ul 
                id={`category-${category.id}-suggestions`}
                className="px-4 pb-3 space-y-2"
              >
                {category.suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left text-sm py-1.5 px-3 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700 disabled:opacity-60"
                      disabled={isDisabled}
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;