import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for articles
const mockArticles = [
  {
    id: 1,
    title: "Understanding the Nairobi Securities Exchange",
    excerpt: "Learn the basics of how the NSE works, the different market segments, and how to start investing in Kenyan stocks.",
    category: "investing",
    tags: ["stocks", "NSE", "beginners"],
    readTime: 7,
    author: "James Mwangi",
    authorTitle: "Investment Analyst",
    date: "2025-03-15",
    imageUrl: "https://via.placeholder.com/800x450",
    featured: true
  },
  {
    id: 2,
    title: "Navigating M-Pesa for Your Financial Goals",
    excerpt: "Discover how M-Pesa can be leveraged beyond simple transfers for savings, investments, and achieving your financial milestones.",
    category: "mobile-money",
    tags: ["M-Pesa", "savings", "mobile banking"],
    readTime: 5,
    author: "Caroline Njeri",
    authorTitle: "FinTech Specialist",
    date: "2025-03-18",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 3,
    title: "Emergency Funds: Why Every Kenyan Needs One",
    excerpt: "Learn why having an emergency fund is crucial, how much you should save, and the best places to keep your emergency money in Kenya.",
    category: "savings",
    tags: ["emergency fund", "financial planning", "savings"],
    readTime: 6,
    author: "Daniel Odhiambo",
    authorTitle: "Financial Planner",
    date: "2025-03-25",
    imageUrl: "https://via.placeholder.com/800x450",
    featured: true
  },
  {
    id: 4,
    title: "Introduction to Treasury Bills in Kenya",
    excerpt: "Understand how T-bills work, their advantages as a low-risk investment, and how to purchase them through the Central Bank of Kenya.",
    category: "investing",
    tags: ["T-bills", "fixed income", "government securities"],
    readTime: 8,
    author: "Sophia Wanjiku",
    authorTitle: "Fixed Income Specialist",
    date: "2025-04-01",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 5,
    title: "Building Credit in Kenya: A Step-by-Step Guide",
    excerpt: "Find out how the credit system works in Kenya, how to check your credit score, and steps to improve your creditworthiness.",
    category: "credit",
    tags: ["credit score", "loans", "financial health"],
    readTime: 6,
    author: "Paul Kamau",
    authorTitle: "Credit Advisor",
    date: "2025-04-03",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 6,
    title: "Retirement Planning for Kenyans",
    excerpt: "Explore the various retirement schemes available in Kenya, including NSSF, pension plans, and personal retirement strategies.",
    category: "retirement",
    tags: ["NSSF", "pension", "retirement planning"],
    readTime: 10,
    author: "Martha Njoroge",
    authorTitle: "Retirement Specialist",
    date: "2025-04-05",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 7,
    title: "Understanding Unit Trusts in Kenya",
    excerpt: "Learn how unit trusts work, their benefits, and how to choose the right unit trust for your investment goals.",
    category: "investing",
    tags: ["unit trusts", "mutual funds", "investments"],
    readTime: 7,
    author: "Brian Kimani",
    authorTitle: "Investment Advisor",
    date: "2025-04-08",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 8,
    title: "The Ultimate Guide to Budgeting in Kenya",
    excerpt: "Discover practical budgeting techniques tailored to the Kenyan context, including the 50/30/20 rule and envelope method.",
    category: "budgeting",
    tags: ["budgeting", "saving", "money management"],
    readTime: 9,
    author: "Esther Wambui",
    authorTitle: "Personal Finance Coach",
    date: "2025-04-10",
    imageUrl: "https://via.placeholder.com/800x450",
    featured: true
  },
  {
    id: 9,
    title: "Real Estate Investment in Kenya: Opportunities and Risks",
    excerpt: "Explore the Kenyan real estate market, investment strategies, potential returns, and how to mitigate risks.",
    category: "investing",
    tags: ["real estate", "property", "investments"],
    readTime: 12,
    author: "John Maina",
    authorTitle: "Real Estate Analyst",
    date: "2025-04-12",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 10,
    title: "Financial Education for Children: Raising Money-Smart Kenyans",
    excerpt: "Discover age-appropriate strategies to teach your children about money, saving, and financial responsibility.",
    category: "family",
    tags: ["children", "education", "financial literacy"],
    readTime: 6,
    author: "Grace Akinyi",
    authorTitle: "Education Specialist",
    date: "2025-04-15",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 11,
    title: "The Benefits of SACCOs in Kenya",
    excerpt: "Understand how Savings and Credit Cooperative Organizations (SACCOs) work and their advantages for Kenyan savers and borrowers.",
    category: "savings",
    tags: ["SACCO", "cooperative", "loans"],
    readTime: 8,
    author: "Samuel Gathuru",
    authorTitle: "Cooperative Banking Expert",
    date: "2025-04-18",
    imageUrl: "https://via.placeholder.com/800x450"
  },
  {
    id: 12,
    title: "Tax Planning for Kenyans: Maximizing Your Income",
    excerpt: "Learn about Kenya's tax system, available deductions, and strategies to legally minimize your tax burden.",
    category: "taxes",
    tags: ["taxes", "KRA", "tax planning"],
    readTime: 9,
    author: "Elizabeth Mutua",
    authorTitle: "Tax Consultant",
    date: "2025-04-20",
    imageUrl: "https://via.placeholder.com/800x450"
  }
];

// List of categories with colors
const categories = [
  { name: "all", label: "All Articles", color: "bg-gray-200 text-gray-800" },
  { name: "investing", label: "Investing", color: "bg-blue-100 text-blue-800" },
  { name: "savings", label: "Savings", color: "bg-green-100 text-green-800" },
  { name: "mobile-money", label: "Mobile Money", color: "bg-purple-100 text-purple-800" },
  { name: "budgeting", label: "Budgeting", color: "bg-yellow-100 text-yellow-800" },
  { name: "credit", label: "Credit", color: "bg-red-100 text-red-800" },
  { name: "retirement", label: "Retirement", color: "bg-orange-100 text-orange-800" },
  { name: "taxes", label: "Taxes", color: "bg-indigo-100 text-indigo-800" },
  { name: "family", label: "Family Finance", color: "bg-pink-100 text-pink-800" }
];

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading articles...</span>
  </div>
);

// Category badge component
const CategoryBadge = ({ category }) => {
  const categoryObj = categories.find(cat => cat.name === category) || categories[0];
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryObj.color}`}>
      {categoryObj.label}
    </span>
  );
};

// Article card component
const ArticleCard = ({ article, featured = false }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${featured ? 'border-2 border-blue-400' : ''}`}>
      <div className="relative">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-48 object-cover"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
            Featured
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
              {article.author.charAt(0)}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{article.author}</p>
              <p className="text-xs text-gray-500">{formatDate(article.date)}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {article.readTime} min read
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs text-gray-500">#{tag}</span>
            ))}
            {article.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{article.tags.length - 2}</span>
            )}
          </div>
          
          <Link 
            to={`/education/articles/${article.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </div>
  );
};

// Featured article component
const FeaturedArticle = ({ article }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="mb-3">
              <CategoryBadge category={article.category} />
              <span className="ml-2 text-blue-600 text-sm font-semibold">Featured Article</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {article.title}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                {article.author.charAt(0)}
              </div>
              <div className="ml-2">
                <p className="font-medium">{article.author}</p>
                <p className="text-sm text-gray-500">{article.authorTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">{formatDate(article.date)}</span>
              <span className="text-sm text-gray-500">{article.readTime} min read</span>
            </div>
          </div>
          
          <Link 
            to={`/education/articles/${article.id}`}
            className="mt-6 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Read Full Article
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = ({ searchTerm }) => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
    </div>
    <h3 className="text-lg font-semibold mb-2">No articles found</h3>
    <p className="text-gray-600 mb-4">
      {searchTerm 
        ? `We couldn't find any articles matching "${searchTerm}". Try a different search term or browse by category.`
        : `No articles available in this category. Please check back later or browse other categories.`
      }
    </p>
  </div>
);

// Main Articles component
const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  
  // Simulate fetching articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Set articles from mock data
        setArticles(mockArticles);
        
        // Find a featured article
        const featured = mockArticles.find(article => article.featured);
        setFeaturedArticle(featured || mockArticles[0]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  // Filter articles based on category and search term
  useEffect(() => {
    if (articles.length === 0) return;
    
    let filtered = [...articles];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(search) ||
        article.excerpt.toLowerCase().includes(search) ||
        article.tags.some(tag => tag.toLowerCase().includes(search)) ||
        article.category.toLowerCase().includes(search)
      );
    }
    
    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchTerm]);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Education</h1>
          <p className="text-gray-600 mt-1">Discover resources to enhance your financial knowledge</p>
        </div>
        
        {/* Search box */}
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm ? (
            <button 
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              onClick={clearSearch}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Categories filter */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map(category => (
            <button
              key={category.name}
              onClick={() => handleCategoryChange(category.name)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category.name 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Featured article */}
      {!searchTerm && selectedCategory === "all" && featuredArticle && (
        <FeaturedArticle article={featuredArticle} />
      )}
      
      {/* Articles grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              featured={article.featured && !(selectedCategory === "all" && !searchTerm)}
            />
          ))}
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}
      
      {/* Pagination (simplified) */}
      {filteredArticles.length > 0 && (
        <div className="mt-10 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 border-t border-b border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
              1
            </button>
            <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Articles;