import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useChatbot } from '../../context/ChatbotContext';
import { useAuth } from '../../context/AuthContext';
import ChatMessage from '../../components/Chatbot/ChatMessage';
import ChatInput from '../../components/Chatbot/ChatInput';
import TypingIndicator from '../../components/Chatbot/TypingIndicator';
import Suggestions from '../../components/Chatbot/Suggestions';

const ChatbotPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    isProcessing, 
    getSuggestions,
    clearConversation,
    loadConversation,
    error: chatError
  } = useChatbot();
  
  const [searchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Handle conversation ID from URL if any
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      setIsLoadingHistory(true);
      loadConversation(conversationId)
        .catch(err => {
          console.error('Failed to load conversation:', err);
          setError('Could not load the conversation. Starting a new one.');
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    }
  }, [searchParams, loadConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Update suggestions when input changes
  useEffect(() => {
    const getMessageSuggestions = async () => {
      if (inputValue.trim().length > 0) {
        try {
          const suggestedMessages = await getSuggestions(inputValue);
          setSuggestions(suggestedMessages.slice(0, 3)); // Limit to 3 suggestions
        } catch (err) {
          console.error('Failed to get suggestions:', err);
          setSuggestions([]);
        }
      } else {
        // When input is empty, offer some default suggestions
        setSuggestions([
          t('chatbot.suggestions.investment'),
          t('chatbot.suggestions.budget'),
          t('chatbot.suggestions.loans')
        ]);
      }
    };

    // Debounce to avoid too many API calls
    const debounceTimer = setTimeout(() => {
      getMessageSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, getSuggestions, t]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Clear input and suggestions
    setInputValue('');
    setSuggestions([]);
    
    try {
      await sendMessage(text);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleStartNewChat = () => {
    clearConversation();
    setError(null);
  };

  // Loading state for initial conversation load
  if (isLoadingHistory) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">{t('chatbot.loadingConversation')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-medium text-gray-900">{t('chatbot.title')}</h1>
          <p className="text-sm text-gray-500">{t('chatbot.subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleStartNewChat}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('chatbot.newChat')}
          </button>
          <Link
            to="/chatbot/history"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('chatbot.history')}
          </Link>
        </div>
      </div>

      {/* Error banner */}
      {(error || chatError) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || chatError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('chatbot.welcome.title')}</h3>
            <p className="text-gray-500 max-w-md mb-6">{t('chatbot.welcome.message')}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              <button
                onClick={() => handleSendMessage(t('chatbot.quickStart.investment'))}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left"
              >
                <span className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-gray-900">{t('chatbot.quickStart.investmentTitle')}</p>
                  <p className="text-xs text-gray-500">{t('chatbot.quickStart.investmentDesc')}</p>
                </div>
              </button>
              
              <button
                onClick={() => handleSendMessage(t('chatbot.quickStart.budget'))}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left"
              >
                <span className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-gray-900">{t('chatbot.quickStart.budgetTitle')}</p>
                  <p className="text-xs text-gray-500">{t('chatbot.quickStart.budgetDesc')}</p>
                </div>
              </button>
              
              <button
                onClick={() => handleSendMessage(t('chatbot.quickStart.loan'))}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left"
              >
                <span className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-gray-900">{t('chatbot.quickStart.loanTitle')}</p>
                  <p className="text-xs text-gray-500">{t('chatbot.quickStart.loanDesc')}</p>
                </div>
              </button>
              
              <button
                onClick={() => handleSendMessage(t('chatbot.quickStart.education'))}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left"
              >
                <span className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-gray-900">{t('chatbot.quickStart.educationTitle')}</p>
                  <p className="text-xs text-gray-500">{t('chatbot.quickStart.educationDesc')}</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
              attachments={message.attachments || []}
            />
          ))
        )}
        
        {isProcessing && <TypingIndicator />}
        
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !isProcessing && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <Suggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
        </div>
      )}

      {/* Chat input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
        <ChatInput
          value={inputValue}
          onChange={handleInputChange}
          onSend={handleSendMessage}
          isDisabled={isProcessing}
          placeholder={t('chatbot.inputPlaceholder')}
        />
      </div>
    </div>
  );
};

export default ChatbotPage;