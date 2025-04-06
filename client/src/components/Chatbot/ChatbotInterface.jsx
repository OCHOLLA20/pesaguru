import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import SuggestionChips from './SuggestionChips';

const ChatbotInterface = ({ 
  initialMessages = [],
  onSendMessage,
  isProcessing = false,
  isFullscreen = false,
  onToggleFullscreen,
  className = "",
}) => {
  // State for chat messages
  const [messages, setMessages] = useState(initialMessages);
  
  // State for user input
  const [inputValue, setInputValue] = useState('');
  
  // State for chat visibility (minimizable on mobile)
  const [isChatVisible, setIsChatVisible] = useState(true);
  
  // Reference to chat container for scrolling
  const chatContainerRef = useRef(null);
  
  // Initial suggestion chips
  const initialSuggestions = [
    { id: 1, text: "Investment advice" },
    { id: 2, text: "Compare loan options" },
    { id: 3, text: "How to budget effectively?" },
    { id: 4, text: "Stock market trends" },
    { id: 5, text: "Retirement planning" },
  ];
  
  // State for suggestion chips
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Call the parent handler if provided
    if (onSendMessage) {
      onSendMessage(inputValue);
    } else {
      // For demo purposes, simulate a bot response after 1 second
      setTimeout(() => {
        simulateBotResponse(inputValue);
      }, 1000);
    }
    
    // Clear input after sending
    setInputValue('');
  };
  
  // Simulate bot response (only for demo/development)
  const simulateBotResponse = (userMessage) => {
    let botResponse;
    
    // Simple demo responses based on user input
    if (userMessage.toLowerCase().includes('invest')) {
      botResponse = {
        id: Date.now(),
        text: "Based on your risk profile, I recommend considering a diversified portfolio with 60% in NSE stocks, 30% in treasury bonds, and 10% in money market funds. Would you like specific stock recommendations?",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      // Update suggestions based on context
      setSuggestions([
        { id: 1, text: "Show stock recommendations" },
        { id: 2, text: "Explain risk levels" },
        { id: 3, text: "How much should I invest?" }
      ]);
    } 
    else if (userMessage.toLowerCase().includes('loan')) {
      botResponse = {
        id: Date.now(),
        text: "I can help you compare loan options. What's the loan amount you're looking for, and what's the purpose (home, education, business)?",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      // Update suggestions for loan context
      setSuggestions([
        { id: 1, text: "Home loan" },
        { id: 2, text: "Education loan" },
        { id: 3, text: "Business loan" }
      ]);
    }
    else if (userMessage.toLowerCase().includes('budget')) {
      botResponse = {
        id: Date.now(),
        text: "For effective budgeting, I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Would you like to create a personalized budget plan?",
        isUser: false,
        timestamp: new Date().toISOString(),
        attachments: [
          {
            type: "chart",
            data: {
              title: "Recommended Budget Allocation",
              chartType: "pie",
              values: [
                { label: "Needs", value: 50, color: "#3b82f6" },
                { label: "Wants", value: 30, color: "#10b981" },
                { label: "Savings", value: 20, color: "#f59e0b" }
              ]
            }
          }
        ]
      };
      
      setSuggestions([
        { id: 1, text: "Create budget plan" },
        { id: 2, text: "Track my expenses" },
        { id: 3, text: "Savings strategies" }
      ]);
    }
    else {
      botResponse = {
        id: Date.now(),
        text: "I'm your PesaGuru financial assistant. I can help with investment advice, loan comparisons, budgeting, and other financial questions. What would you like to know about today?",
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      // Reset to initial suggestions
      setSuggestions(initialSuggestions);
    }
    
    setMessages(prevMessages => [...prevMessages, botResponse]);
  };
  
  // Handle suggestion chip click
  const handleSuggestionClick = (suggestionText) => {
    setInputValue(suggestionText);
    
    // Automatically send the suggestion as a message
    const newUserMessage = {
      id: Date.now(),
      text: suggestionText,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Call the parent handler or simulate response
    if (onSendMessage) {
      onSendMessage(suggestionText);
    } else {
      setTimeout(() => {
        simulateBotResponse(suggestionText);
      }, 1000);
    }
  };
  
  // Handle input change
  const handleInputChange = (value) => {
    setInputValue(value);
  };
  
  // Toggle chat visibility on mobile
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };
  
  // Check if chat has any messages
  const hasMessages = messages.length > 0;
  
  // Get welcome message if no messages
  const getWelcomeMessage = () => {
    return {
      id: 'welcome',
      text: "Hello! I'm PesaGuru, your personal financial advisor. I can help you with investment planning, loan comparisons, budgeting advice, and more. How can I assist you today?",
      isUser: false,
      timestamp: new Date().toISOString()
    };
  };
  
  // Ensure there's a welcome message if no messages exist
  const displayMessages = hasMessages ? messages : [getWelcomeMessage()];
  
  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative h-[600px]'} rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Chat Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 mr-2">
            <span className="font-bold">PG</span>
          </div>
          <div>
            <h3 className="font-semibold">PesaGuru Assistant</h3>
            <p className="text-xs text-blue-100">Financial Advisory Bot</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              setMessages([]);
              setSuggestions(initialSuggestions);
            }}
            className="p-1 rounded-full hover:bg-blue-500 transition-colors"
            title="Reset conversation"
          >
            <RefreshCw size={18} />
          </button>
          
          {onToggleFullscreen && (
            <button 
              onClick={onToggleFullscreen}
              className="p-1 rounded-full hover:bg-blue-500 transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          )}
          
          <button 
            onClick={toggleChatVisibility}
            className="p-1 rounded-full hover:bg-blue-500 transition-colors md:hidden"
            title={isChatVisible ? "Minimize chat" : "Expand chat"}
          >
            {isChatVisible ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>
      
      {/* Chat Body - conditionally rendered based on visibility state */}
      {isChatVisible && (
        <>
          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
          >
            {displayMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                attachments={message.attachments}
              />
            ))}
            
            {isProcessing && <TypingIndicator />}
          </div>
          
          {/* Suggestion Chips */}
          <div className="px-4 py-2 bg-white border-t border-gray-200">
            <SuggestionChips 
              suggestions={suggestions} 
              onSuggestionClick={handleSuggestionClick} 
            />
          </div>
          
          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <ChatInput
              value={inputValue}
              onChange={handleInputChange}
              onSend={handleSendMessage}
              isProcessing={isProcessing}
              placeholder="Ask me about investments, loans, or budgeting..."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotInterface;