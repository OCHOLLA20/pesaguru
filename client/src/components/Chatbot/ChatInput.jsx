import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

const ChatInput = ({ onSendMessage, isDisabled = false, suggestions = [] }) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim());
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSendMessage(suggestion);
    setMessage('');
    setShowSuggestions(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isDisabled}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 hover:bg-blue-200 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            disabled={isDisabled}
            placeholder="Ask about investments, loans, or budgeting..."
            className="w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-4 pr-12 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-75"
          />
          
          {/* Voice input button (placeholder for future functionality) */}
          <button
            type="button"
            disabled={isDisabled}
            className="absolute inset-y-0 right-12 flex items-center px-3 text-gray-500 hover:text-blue-600 disabled:opacity-50"
          >
            <Mic size={20} />
          </button>
        </div>
        
        {/* Send button */}
        <button
          type="submit"
          disabled={isDisabled || !message.trim()}
          className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:opacity-75"
        >
          <Send size={20} />
        </button>
      </form>

      {/* Expanded suggestions dropdown */}
      {showSuggestions && suggestions.length > 3 && (
        <div 
          ref={suggestionsRef}
          className="absolute bottom-20 left-4 right-4 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white p-2 shadow-lg"
        >
          {suggestions.slice(3).map((suggestion, index) => (
            <div
              key={index + 3}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;