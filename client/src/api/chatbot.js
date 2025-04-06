import apiClient from './client';

/**
 * Send a message to the chatbot and get a response
 * @param {Object} messageData - The message data to send
 * @param {string} messageData.message - The message text
 * @param {Object} [messageData.context] - Optional context information
 * @returns {Promise<Object>} The chatbot response
 */
export const sendChatMessage = async (messageData) => {
  try {
    const response = await apiClient.post('/chatbot/message', messageData);
    return response;
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
};

/**
 * Fetch conversation history for a specific conversation
 * @param {string|number} conversationId - The ID of the conversation to fetch
 * @param {number} [limit=50] - Maximum number of messages to retrieve
 * @returns {Promise<Array>} The conversation messages
 */
export const getChatHistory = async (conversationId, limit = 50) => {
  try {
    const response = await apiClient.get(`/chatbot/history/${conversationId}`, { 
      params: { limit } 
    });
    return response;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

/**
 * Get a list of all user conversations
 * @returns {Promise<Array>} List of conversation summaries
 */
export const getUserConversations = async () => {
  try {
    const response = await apiClient.get('/chatbot/conversations');
    return response;
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    throw error;
  }
};

/**
 * Get suggested responses or queries based on current conversation
 * @param {string} [query] - Optional partial query to get suggestions for
 * @returns {Promise<Array>} List of suggested messages
 */
export const getChatbotSuggestions = async (query = '') => {
  try {
    const response = await apiClient.get('/chatbot/suggestions', {
      params: { query }
    });
    return response;
  } catch (error) {
    console.error('Error fetching chatbot suggestions:', error);
    throw error;
  }
};

/**
 * Get client-side suggestions for common financial queries
 * Can be used as a fallback when API is unavailable or for quick responses
 * @param {string} [category='general'] - Category of suggestions to return
 * @param {string} [userContext=null] - Optional user context to personalize suggestions
 * @returns {Array<string>} Array of suggested queries
 */
export const getSuggestions = (category = 'general', userContext = null) => {
  const suggestions = {
    general: [
      "What's my current financial status?",
      "How can I start investing?",
      "What are the best savings options in Kenya?",
      "How do I create a budget?",
      "Explain investment risk levels"
    ],
    investment: [
      "What stocks should I invest in?",
      "How do I buy shares on NSE?",
      "Show me top performing stocks",
      "Compare treasury bills vs. bonds",
      "What are the best performing sectors?"
    ],
    loans: [
      "Compare personal loan options",
      "What's the best mortgage rate?",
      "How much can I afford to borrow?",
      "What documents do I need for a loan?",
      "How to improve my credit score"
    ],
    planning: [
      "Help me plan for retirement",
      "How to save for my child's education",
      "Create a savings goal",
      "How to buy a home in Kenya",
      "Best way to track my expenses"
    ]
  };
  
  // Select context-specific suggestions if context is provided
  if (userContext && userContext.recentTopic) {
    // Return category-specific suggestions based on user's recent interactions
    return suggestions[userContext.recentTopic] || suggestions.general;
  }
  
  // Return suggestions for the requested category or default to general
  return suggestions[category] || suggestions.general;
};

/**
 * Start a new conversation
 * @param {Object} [initData] - Optional initialization data for the conversation
 * @param {string} [initData.topic] - Topic of the conversation
 * @param {string} [initData.initialContext] - Initial context data
 * @returns {Promise<Object>} The new conversation object
 */
export const startNewConversation = async (initData = {}) => {
  try {
    const response = await apiClient.post('/chatbot/conversations', initData);
    return response;
  } catch (error) {
    console.error('Error starting new conversation:', error);
    throw error;
  }
};

/**
 * Upload financial document for analysis by the chatbot
 * @param {File} file - The file to upload
 * @param {string|number} conversationId - The conversation ID
 * @returns {Promise<Object>} The upload result
 */
export const uploadFinancialDocument = async (file, conversationId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);
    
    const response = await apiClient.post('/chatbot/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error uploading financial document:', error);
    throw error;
  }
};

/**
 * Provide feedback on a specific chatbot response
 * @param {Object} feedbackData - The feedback data
 * @param {string|number} feedbackData.messageId - ID of the message receiving feedback
 * @param {boolean} feedbackData.helpful - Whether the response was helpful
 * @param {string} [feedbackData.comment] - Optional comment on the response
 * @returns {Promise<Object>} The feedback submission result
 */
export const provideChatbotFeedback = async (feedbackData) => {
  try {
    const response = await apiClient.post('/chatbot/feedback', feedbackData);
    return response;
  } catch (error) {
    console.error('Error providing chatbot feedback:', error);
    throw error;
  }
};

/**
 * Get common financial topics the chatbot can discuss
 * @returns {Promise<Array>} List of suggested financial topics
 */
export const getFinancialTopics = async () => {
  try {
    const response = await apiClient.get('/chatbot/topics');
    return response;
  } catch (error) {
    console.error('Error fetching financial topics:', error);
    throw error;
  }
};