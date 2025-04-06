import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendChatMessage, getChatHistory, getChatbotSuggestions } from '../api/chatbot';
import { useAuth } from './AuthContext';

/**
 * ChatbotContext provides state and functions for interacting with the PesaGuru financial advisor chatbot
 */
const ChatbotContext = createContext(null);

export const ChatbotProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Load conversation history when authenticated and conversationId is available
  useEffect(() => {
    const loadHistory = async () => {
      if (isAuthenticated && conversationId) {
        try {
          setIsProcessing(true);
          const history = await getChatHistory(conversationId);
          setMessages(history);
        } catch (err) {
          console.error('Failed to load chat history:', err);
          setError('Could not load conversation history');
        } finally {
          setIsProcessing(false);
        }
      }
    };

    loadHistory();
  }, [isAuthenticated, conversationId]);

  // Initialize with welcome message if no messages
  useEffect(() => {
    if (messages.length === 0 && !conversationId) {
      setMessages([{
        id: 'welcome',
        text: 'Hello! I am PesaGuru, your financial advisor. How can I help you today?',
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [messages.length, conversationId]);

  // Load message suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      if (isAuthenticated) {
        try {
          const suggestionData = await getChatbotSuggestions();
          setSuggestions(suggestionData);
        } catch (err) {
          console.error('Failed to load suggestions:', err);
        }
      }
    };

    loadSuggestions();
  }, [isAuthenticated]);

  /**
   * Send a message to the chatbot
   * @param {string} text - The message text to send
   * @returns {Promise<void>}
   */
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null);

    try {
      // Send to server
      const response = await sendChatMessage({
        message: text,
        conversationId: conversationId
      });

      // Save conversation ID from first message
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }

      // Add bot response
      const botMessage = {
        id: response.id || Date.now().toString() + '-bot',
        text: response.text,
        isUser: false,
        timestamp: response.timestamp || new Date().toISOString(),
        attachments: response.attachments || []
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update suggestions if provided
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
      
      return response;
    } catch (err) {
      console.error('Message sending failed:', err);
      setError('Failed to send message');
      
      // Add error message
      const errorMessage = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Clear the current conversation and start a new one
   */
  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    
    // Add welcome message
    setMessages([{
      id: 'welcome-' + Date.now(),
      text: 'Hello! I am PesaGuru, your financial advisor. How can I help you today?',
      isUser: false,
      timestamp: new Date().toISOString()
    }]);
  };

  /**
   * Use a suggestion as a message
   * @param {string} suggestion - The suggestion text to use
   */
  const useSuggestion = async (suggestion) => {
    await sendMessage(suggestion);
  };

  return (
    <ChatbotContext.Provider value={{
      messages,
      isProcessing,
      error,
      suggestions,
      sendMessage,
      clearConversation,
      useSuggestion,
      conversationId
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

/**
 * Custom hook to use the chatbot context
 * @returns {Object} Chatbot context value
 */
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};