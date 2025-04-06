import { useState, useEffect, useCallback, useContext } from 'react';
import { sendChatMessage, getChatHistory, getChatbotSuggestions } from '../api/chatbot';
import { useAuth } from './useAuth';
import { ChatbotContext } from '../context/ChatbotContext';

/**
 * Custom hook for interacting with the PesaGuru financial advisory chatbot
 * Manages conversation state, message sending, and history
 */
const useChatbot = () => {
  // Use ChatbotContext if component is within ChatbotProvider
  const context = useContext(ChatbotContext);
  if (context) {
    return context;
  }
  
  // Fallback to local state if not within provider
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  // Load chat history when component mounts or user changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user?.id || !conversationId) return;
      
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
    };

    if (conversationId) {
      loadChatHistory();
    } else {
      // Add initial welcome message if no history
      setMessages([{
        id: 'welcome',
        text: 'Hello! I am PesaGuru, your financial advisor. How can I help you today?',
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [user?.id, conversationId]);

  // Get message suggestions
  const getSuggestions = useCallback(async (query = '') => {
    try {
      const suggestionData = await getChatbotSuggestions(query);
      setSuggestions(suggestionData);
      return suggestionData;
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      return [];
    }
  }, []);

  // Send message to chatbot
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message immediately to UI
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
      // Send to API
      const response = await sendChatMessage({
        message: text,
        conversation_id: conversationId
      });

      // Save conversation ID from first message
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }

      // Add bot response to messages
      const botMessage = {
        id: response.id,
        text: response.text,
        isUser: false,
        timestamp: response.timestamp,
        attachments: response.attachments || []
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Get new suggestions based on context
      getSuggestions();
      
      return botMessage;
    } catch (err) {
      console.error('Message sending failed:', err);
      setError('Failed to send message');
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
      
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [conversationId, getSuggestions]);

  // Clear current conversation
  const clearConversation = useCallback(() => {
    setMessages([{
      id: 'welcome',
      text: 'Hello! I am PesaGuru, your financial advisor. How can I help you today?',
      isUser: false,
      timestamp: new Date().toISOString()
    }]);
    setConversationId(null);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    messages,
    isProcessing,
    error,
    suggestions,
    conversationId,
    sendMessage,
    getSuggestions,
    clearConversation,
  };
};

/**
 * Provider component for chatbot functionality
 * Use this to wrap components that need chatbot capabilities
 */
export const ChatbotProvider = ({ children }) => {
  const chatbotMethods = useChatbot();
  
  return (
    <ChatbotContext.Provider value={chatbotMethods}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default useChatbot;