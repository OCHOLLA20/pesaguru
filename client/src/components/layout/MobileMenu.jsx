import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X, Home, BarChart2, MessageSquare, DollarSign, Book, Settings, Target } from 'lucide-react';

const MobileMenu = ({ open, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Investments', icon: BarChart2, href: '/investments', current: location.pathname.startsWith('/investments') },
    { name: 'Financial Advisor', icon: MessageSquare, href: '/chatbot', current: location.pathname === '/chatbot' },
    { name: 'Loans', icon: DollarSign, href: '/loans', current: location.pathname.startsWith('/loans') },
    { name: 'Financial Goals', icon: Target, href: '/goals', current: location.pathname.startsWith('/goals') },
    { name: 'Learning', icon: Book, href: '/education', current: location.pathname.startsWith('/education') },
    { name: 'Settings', icon: Settings, href: '/settings', current: location.pathname === '/settings' },
  ];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-800">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={onClose}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </Transition.Child>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-800" />
                  </div>
                  <span className="text-xl font-bold text-white">PesaGuru</span>
                </Link>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-700'
                    } group flex items-center px-3 py-2 text-base font-medium rounded-md`}
                    onClick={onClose}
                  >
                    <item.icon
                      className="mr-4 h-6 w-6 text-blue-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex-shrink-0 flex border-t border-blue-700 p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  S
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">Sharon</p>
                  <p className="text-sm text-blue-300">Moderate Risk Profile</p>
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
        
        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MobileMenu;