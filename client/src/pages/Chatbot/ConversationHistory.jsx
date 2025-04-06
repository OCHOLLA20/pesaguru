import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getChatHistory, deleteConversation } from '../../api/chatbot';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatTime } from '../../utils/formatters';

const ConversationHistory = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const history = await getChatHistory();
      
      // Group conversations by date
      const groupedConversations = groupByDate(history);
      setConversations(groupedConversations);
    } catch (err) {
      console.error('Failed to fetch conversation history:', err);
      setError('Could not load your conversation history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const groupByDate = (conversations) => {
    const grouped = {};
    
    conversations.forEach(conversation => {
      const date = new Date(conversation.created_at).toDateString();
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(conversation);
    });
    
    // Convert to array sorted by date (newest first)
    return Object.entries(grouped)
      .map(([date, convos]) => ({
        date,
        conversations: convos.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleContinueConversation = (conversationId) => {
    navigate(`/chatbot?conversation=${conversationId}`);
  };

  const confirmDelete = (conversationId) => {
    setDeleteConfirmation(conversationId);
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await deleteConversation(conversationId);
      fetchConversations();
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Could not delete the conversation. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const getConversationTitle = (conversation) => {
    // Try to extract a meaningful title from the first few messages
    if (conversation.messages && conversation.messages.length > 0) {
      const firstUserMessage = conversation.messages.find(m => m.is_user);
      if (firstUserMessage) {
        // Truncate if too long
        return firstUserMessage.content.length > 50 
          ? `${firstUserMessage.content.substring(0, 50)}...` 
          : firstUserMessage.content;
      }
    }
    
    // Fallback to date and time
    return `Conversation on ${formatDate(conversation.created_at)}`;
  };

  const getPreviewText = (conversation) => {
    // Get the latest bot message as preview
    if (conversation.messages && conversation.messages.length > 0) {
      const lastBotMessage = [...conversation.messages]
        .reverse()
        .find(m => !m.is_user);
      
      if (lastBotMessage) {
        return lastBotMessage.content.length > 100 
          ? `${lastBotMessage.content.substring(0, 100)}...` 
          : lastBotMessage.content;
      }
    }
    
    return 'No messages in this conversation';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading your conversations...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-2">Error</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchConversations}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
        <p className="text-gray-600 mb-4">Start a new conversation with PesaGuru</p>
        <Link 
          to="/chatbot"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Start Chatting
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Conversation History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Your previous chats with PesaGuru</p>
      </div>
      
      <div className="bg-gray-50">
        <div className="flex">
          {/* Conversation list - visible on all screens but optimized for mobile */}
          <div className={`w-full md:w-1/3 border-r border-gray-200 ${selectedConversation ? 'hidden md:block' : ''}`}>
            {conversations.map((group) => (
              <div key={group.date} className="border-b border-gray-200">
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  {new Date(group.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                
                <ul>
                  {group.conversations.map((conversation) => (
                    <li 
                      key={conversation.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getConversationTitle(conversation)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(conversation.created_at)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {getPreviewText(conversation)}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinueConversation(conversation.id);
                            }}
                            className="mr-2 text-blue-600 hover:text-blue-800"
                            title="Continue conversation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(conversation.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Delete conversation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Conversation detail - hidden on mobile when no conversation is selected */}
          {selectedConversation ? (
            <div className="w-full md:w-2/3 bg-white">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {getConversationTitle(selectedConversation)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedConversation.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex">
                  <button 
                    onClick={() => setSelectedConversation(null)} 
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleContinueConversation(selectedConversation.id)}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Continue Conversation
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {selectedConversation.messages && selectedConversation.messages.map((message, idx) => (
                  <div 
                    key={message.id || idx} 
                    className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                        message.is_user 
                          ? 'bg-blue-100 text-blue-900' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!selectedConversation.messages || selectedConversation.messages.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No messages in this conversation
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex md:w-2/3 bg-white items-center justify-center p-8">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Conversation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConversation(deleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create new conversation button (fixed at bottom on mobile) */}
      <div className="md:hidden fixed bottom-5 right-5">
        <Link 
          to="/chatbot"
          className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ConversationHistory;