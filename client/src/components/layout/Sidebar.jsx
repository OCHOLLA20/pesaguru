import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  MessageSquare, 
  DollarSign, 
  Book, 
  Settings, 
  HelpCircle, 
  AlertTriangle,
  Target 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Investments', icon: BarChart2, href: '/investments', current: location.pathname.startsWith('/investments') },
    { name: 'Financial Advisor', icon: MessageSquare, href: '/chatbot', current: location.pathname === '/chatbot' },
    { name: 'Loans', icon: DollarSign, href: '/loans', current: location.pathname.startsWith('/loans') },
    { name: 'Financial Goals', icon: Target, href: '/goals', current: location.pathname.startsWith('/goals') },
    { name: 'Learning', icon: Book, href: '/education', current: location.pathname.startsWith('/education') },
  ];

  const secondaryNavigation = [
    { name: 'Settings', icon: Settings, href: '/settings' },
    { name: 'Help & Support', icon: HelpCircle, href: '/support' },
  ];

  return (
    <div className="h-full flex flex-col bg-blue-800 text-white">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 flex-shrink-0 bg-blue-900">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-blue-800" />
          </div>
          <span className="text-xl font-bold">PesaGuru</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                item.current
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <item.icon
                className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="mt-6 px-3">
          <div className="bg-blue-700 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-300 mr-2" />
              <h3 className="text-sm font-medium text-white">Quick Tip</h3>
            </div>
            <p className="text-xs text-blue-200">
              Remember to diversify your investment portfolio to manage risk effectively.
            </p>
            <a href="/education/diversification" className="mt-2 text-xs text-yellow-300 hover:text-yellow-200 block">
              Learn more about diversification →
            </a>
          </div>
        </div>
      </div>
      
      {/* Secondary Navigation */}
      <div className="border-t border-blue-700 px-2 py-4 space-y-1">
        {secondaryNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="text-blue-100 hover:bg-blue-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
          >
            <item.icon
              className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white"
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </div>
      
      {/* User info */}
      <div className="border-t border-blue-700 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            S
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Sharon</p>
            <p className="text-xs text-blue-300">Moderate Risk Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;