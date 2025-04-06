import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

// This would be fetched from an API in a real implementation
const EDUCATION_TOPICS = [
  { id: 'investing', icon: '📈' },
  { id: 'saving', icon: '💰' },
  { id: 'budgeting', icon: '📊' },
  { id: 'credit', icon: '💳' },
  { id: 'retirement', icon: '🏖️' },
  { id: 'taxes', icon: '📝' },
  { id: 'insurance', icon: '🛡️' },
  { id: 'property', icon: '🏠' }
];

// Mock articles data
const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'Understanding the Nairobi Securities Exchange',
    description: 'Learn how to navigate the NSE and make informed investment decisions.',
    topic: 'investing',
    readTime: 5,
    image: '/api/placeholder/300/200',
    popular: true
  },
  {
    id: 2,
    title: 'Building an Emergency Fund: Why and How',
    description: 'The importance of having savings for unexpected expenses and how to build it up.',
    topic: 'saving',
    readTime: 4,
    image: '/api/placeholder/300/200',
    popular: true
  },
  {
    id: 3,
    title: 'Creating a Monthly Budget That Works',
    description: 'Practical tips for tracking your income and expenses effectively.',
    topic: 'budgeting',
    readTime: 6,
    image: '/api/placeholder/300/200',
    popular: false
  },
  {
    id: 4,
    title: 'Understanding Credit Scores in Kenya',
    description: 'How credit scores work in Kenya and ways to improve your creditworthiness.',
    topic: 'credit',
    readTime: 7,
    image: '/api/placeholder/300/200',
    popular: false
  },
  {
    id: 5,
    title: 'Planning for Retirement: Early Steps',
    description: 'Why its never too early to start planning for retirement and how to begin.',
    topic: 'retirement',
    readTime: 8,
    image: '/api/placeholder/300/200',
    popular: false
  },
  {
    id: 6,
    title: 'Tax Planning for Small Business Owners',
    description: 'Optimize your tax strategy and understand your obligations as a business owner.',
    topic: 'taxes',
    readTime: 10,
    image: '/api/placeholder/300/200',
    popular: false
  }
];

const EducationHub = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(MOCK_ARTICLES);

  // Apply filters when activeFilter or searchQuery changes
  useEffect(() => {
    let results = MOCK_ARTICLES;
    
    // Apply topic filter
    if (activeFilter !== 'all') {
      results = results.filter(article => article.topic === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredArticles(results);
  }, [activeFilter, searchQuery]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t('education.title', 'Financial Education Hub')}
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {t('education.subtitle', 'Improve your financial literacy with these resources. Learn about investing, saving, budgeting, and more.')}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-8 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={t('education.searchPlaceholder', 'Search articles...')}
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Topic filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {t('education.allTopics', 'All Topics')}
        </button>
        
        {EDUCATION_TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => setActiveFilter(topic.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              activeFilter === topic.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{topic.icon}</span>
            {t(`education.topics.${topic.id}`, topic.id)}
          </button>
        ))}
      </div>

      {/* Popular articles section (only show if not filtering) */}
      {activeFilter === 'all' && !searchQuery && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {t('education.popularArticles', 'Popular Articles')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ARTICLES.filter(article => article.popular).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* All articles grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {activeFilter === 'all' 
            ? t('education.allArticles', 'All Articles') 
            : t(`education.topicArticles`, '{{topic}} Articles', { topic: t(`education.topics.${activeFilter}`, activeFilter) })}
        </h2>
        
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {t('education.noResults', 'No articles found')}
            </h3>
            <p className="text-gray-600">
              {t('education.tryDifferent', 'Try a different search term or filter')}
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {t('education.resetFilters', 'Reset Filters')}
            </button>
          </div>
        )}
      </div>

      {/* Ask the chatbot card */}
      <div className="mt-16 bg-blue-50 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t('education.needMoreHelp', 'Need more personalized guidance?')}
          </h3>
          <p className="text-gray-600">
            {t('education.askChatbot', 'Ask PesaGuru AI assistant about any financial topic')}
          </p>
        </div>
        <Link
          to="/chatbot"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
        >
          <span className="mr-2">💬</span>
          {t('education.chatWithGuru', 'Chat with PesaGuru')}
        </Link>
      </div>
    </div>
  );
};

// Article card component
const ArticleCard = ({ article }) => {
  const { t } = useTranslation();
  
  return (
    <Link to={`/education/articles/${article.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
        <div className="relative h-48 bg-gray-200">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs font-medium m-2 rounded">
            {EDUCATION_TOPICS.find(topic => topic.id === article.topic)?.icon} {t(`education.topics.${article.topic}`, article.topic)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {article.readTime} {t('education.minuteRead', 'min read')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EducationHub;