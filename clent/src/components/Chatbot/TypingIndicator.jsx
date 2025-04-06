import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-end mb-4">
      {/* Bot avatar */}
      <div className="flex-shrink-0 mr-2">
        <div className="p-2 rounded-full bg-indigo-100">
          <Bot size={16} className="text-indigo-600" />
        </div>
      </div>
      
      {/* Typing indicator bubble */}
      <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center">
        <span className="sr-only">PesaGuru is typing</span>
        <div className="flex space-x-1">
          <div className="typing-dot bg-gray-500 h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="typing-dot bg-gray-500 h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="typing-dot bg-gray-500 h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;