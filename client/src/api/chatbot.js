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