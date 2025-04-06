import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * ChatbotSuggestion component displays a suggestion to use the chatbot
 * for getting help or more information about a specific topic
 */
const ChatbotSuggestion = ({ 
  title, 
  message, 
  suggestedQuestions = [],
  onQuestionClick,
  className = '' 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className="h-6 w-6 text-blue-600 dark:text-blue-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
            {title || t('common.chatbotSuggestion.defaultTitle')}
          </h3>
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
            <p>{message || t('common.chatbotSuggestion.defaultMessage')}</p>
          </div>
          
          {suggestedQuestions.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-2">
                {t('common.chatbotSuggestion.suggestedQuestions')}:
              </h4>
              <ul className="space-y-1">
                {suggestedQuestions.map((question, index) => (
                  <li key={index}>
                    <button
                      onClick={() => onQuestionClick && onQuestionClick(question)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4">
            <Link 
              to="/chatbot" 
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              {t('common.chatbotSuggestion.openChatbot')} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSuggestion;
