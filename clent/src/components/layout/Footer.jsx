import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, DollarSign } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5" />
            </Link>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </Link>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-end">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-blue-800 mr-1" />
              <span className="text-sm text-gray-500">
                PesaGuru © {new Date().getFullYear()} - AI-powered financial advisory
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center md:text-right text-xs text-gray-400">
          <p>
            This is not professional financial advice. Always consult a certified financial advisor for personalized guidance.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;