import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

const Glossary = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Sample glossary terms - in a real app, you would fetch this from an API
  const glossaryTerms = useMemo(() => [
    {
      term: 'Asset',
      definition: 'Anything of value that can be converted into cash. Assets include real estate, vehicles, investments, savings, and cash equivalents.',
      category: 'Investment'
    },
    {
      term: 'Bond',
      definition: 'A fixed-income investment where an investor loans money to a corporate or governmental entity for a set period at a variable or fixed interest rate.',
      category: 'Investment'
    },
    {
      term: 'Capital Gain',
      definition: 'The profit realized when an asset is sold for a higher price than the original purchase price.',
      category: 'Tax'
    },
    {
      term: 'Diversification',
      definition: 'A risk management strategy that mixes a variety of investments within a portfolio to minimize the impact of any single investment performing poorly.',
      category: 'Investment'
    },
    {
      term: 'Equity',
      definition: 'Ownership interest in a company, usually in the form of stock. It can also refer to the value of an asset after liabilities are subtracted.',
      category: 'Investment'
    },
    {
      term: 'Fixed Deposit',
      definition: 'A financial instrument provided by banks which provides investors a higher rate of interest than a regular savings account, until the given maturity date.',
      category: 'Banking'
    },
    {
      term: 'Inflation',
      definition: 'A general increase in prices and fall in the purchasing power of money over time.',
      category: 'Economics'
    },
    {
      term: 'M-Pesa',
      definition: 'A mobile phone-based money transfer, financing, and microfinancing service launched in Kenya by Vodafone and Safaricom.',
      category: 'Banking'
    },
    {
      term: 'Nairobi Securities Exchange (NSE)',
      definition: 'The principal stock exchange of Kenya. It began in 1954 as an overseas stock exchange while Kenya was still a British colony.',
      category: 'Investment'
    },
    {
      term: 'Portfolio',
      definition: 'A collection of financial investments like stocks, bonds, commodities, cash, and cash equivalents, as well as their mutual, exchange-traded, and closed funds.',
      category: 'Investment'
    },
    {
      term: 'Risk',
      definition: 'The possibility of losing some or all of an investment. Higher risk investments generally have higher potential returns.',
      category: 'Investment'
    },
    {
      term: 'SACCO',
      definition: 'Savings and Credit Cooperative Organizations are member-owned financial cooperatives common in Kenya that provide savings and credit services to members.',
      category: 'Banking'
    },
    {
      term: 'Treasury Bill',
      definition: 'A short-term government debt security with a maturity of less than one year. T-bills are sold at a discount to face value and do not pay interest before maturity.',
      category: 'Investment'
    },
    {
      term: 'Yield',
      definition: 'The income generated from an investment over a specific period of time, expressed as a percentage of the investments cost or current market value.',
      category: 'Investment'
    },
    {
      term: 'Zakat',
      definition: 'An Islamic finance term referring to the obligation that an individual has to donate a certain proportion of wealth each year to charitable causes.',
      category: 'Islamic Finance'
    }
  ], []);

  // Organize terms by first letter
  const organizeTermsByLetter = useMemo(() => {
    const terms = searchTerm 
      ? glossaryTerms.filter(term => 
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
          term.definition.toLowerCase().includes(searchTerm.toLowerCase()))
      : glossaryTerms;
    
    const organized = {};
    
    terms.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!organized[firstLetter]) {
        organized[firstLetter] = [];
      }
      organized[firstLetter].push(term);
    });
    
    return organized;
  }, [glossaryTerms, searchTerm]);

  // Get all available letters for index
  const availableLetters = useMemo(() => {
    return Object.keys(organizeTermsByLetter).sort();
  }, [organizeTermsByLetter]);

  const handleLetterClick = (letter) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveIndex(letter);
    }
  };
  
  // Handle scroll events to update active index
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Find which letter section is currently visible
      for (const letter of availableLetters) {
        const element = document.getElementById(`letter-${letter}`);
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top <= 100) {
            setActiveIndex(letter);
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [availableLetters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Glossary</h1>
      <p className="text-gray-600 mb-8">
        Explore common financial terms and concepts to improve your financial literacy and make informed decisions.
      </p>
      
      {/* Search bar */}
      <div className="mb-8 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 pr-4 py-2 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border border-gray-300"
            placeholder="Search terms or definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Index of letters */}
      <div className="flex flex-wrap gap-2 mb-8 sticky top-0 bg-white py-3 z-10 border-b">
        {availableLetters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`w-8 h-8 flex items-center justify-center rounded-full
              ${activeIndex === letter 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {/* No results message */}
      {availableLetters.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No terms found for "{searchTerm}"</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </button>
        </div>
      )}
      
      {/* Glossary terms grouped by first letter */}
      {availableLetters.map(letter => (
        <div key={letter} id={`letter-${letter}`} className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">{letter}</h2>
          <div className="space-y-6">
            {organizeTermsByLetter[letter].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900">{item.term}</h3>
                <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs mb-2">
                  {item.category}
                </span>
                <p className="text-gray-600">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Glossary;