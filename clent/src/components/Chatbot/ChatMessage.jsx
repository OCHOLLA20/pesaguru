import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const ChatMessage = ({
  message,
  isUser,
  timestamp,
  attachments = [],
  isError = false
}) => {
  const [expanded, setExpanded] = React.useState(false);
  
  // Format the timestamp
  const formattedTime = timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : '';
  
  // Handle links in message text
  const renderMessageWithLinks = (text) => {
    // URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    // Split text by URLs and map each part
    const parts = text.split(urlPattern);
    const matches = text.match(urlPattern) || [];
    
    return parts.reduce((result, part, i) => {
      result.push(part);
      if (matches[i]) {
        result.push(
          <a 
            key={i} 
            href={matches[i]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            {matches[i].replace(/^https?:\/\//, '')}
            <ExternalLink size={14} className="ml-1" />
          </a>
        );
      }
      return result;
    }, []);
  };
  
  // Render financial attachment cards
  const renderAttachment = (attachment, index) => {
    switch (attachment.type) {
      case 'stock_recommendation':
        return (
          <div key={index} className="bg-blue-50 p-3 rounded-md border border-blue-200 mt-2">
            <h4 className="font-medium text-blue-800">{attachment.symbol} - {attachment.name}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm">
              <div className="text-gray-600">Current Price:</div>
              <div className="font-medium">KES {attachment.price.toLocaleString()}</div>
              <div className="text-gray-600">Recommended:</div>
              <div className={`font-medium ${attachment.action === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                {attachment.action}
              </div>
              {attachment.potential_return && (
                <>
                  <div className="text-gray-600">Potential Return:</div>
                  <div className="font-medium">{attachment.potential_return}%</div>
                </>
              )}
            </div>
          </div>
        );
      
      case 'loan_comparison':
        return (
          <div key={index} className="bg-purple-50 p-3 rounded-md border border-purple-200 mt-2">
            <h4 className="font-medium text-purple-800">{attachment.name}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm">
              <div className="text-gray-600">Interest Rate:</div>
              <div className="font-medium">{attachment.rate}%</div>
              <div className="text-gray-600">Term:</div>
              <div className="font-medium">{attachment.term} months</div>
              <div className="text-gray-600">Monthly Payment:</div>
              <div className="font-medium">KES {attachment.monthly_payment.toLocaleString()}</div>
            </div>
          </div>
        );
      
      case 'budget_tip':
        return (
          <div key={index} className="bg-green-50 p-3 rounded-md border border-green-200 mt-2">
            <h4 className="font-medium text-green-800">{attachment.title}</h4>
            <p className="text-sm mt-1">{attachment.description}</p>
            {attachment.saving_potential && (
              <p className="text-sm font-medium text-green-700 mt-1">
                Potential monthly saving: KES {attachment.saving_potential.toLocaleString()}
              </p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      aria-label={isUser ? 'Your message' : 'PesaGuru message'}
    >
      <div className={`flex max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 self-end ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`p-2 rounded-full ${isUser ? 'bg-blue-100' : 'bg-indigo-100'}`}>
            {isUser ? (
              <User size={16} className="text-blue-600" />
            ) : (
              <Bot size={16} className="text-indigo-600" />
            )}
          </div>
        </div>
        
        {/* Message content */}
        <div>
          <div 
            className={`p-3 rounded-lg shadow-sm ${
              isUser 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : isError 
                  ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}
          >
            {/* Error indicator */}
            {isError && (
              <div className="flex items-center mb-2 text-red-600">
                <AlertCircle size={16} className="mr-1" />
                <span className="text-sm font-medium">Error</span>
              </div>
            )}
            
            {/* Message text */}
            <div className={expanded ? '' : `${attachments.length > 0 ? 'line-clamp-5' : ''}`}>
              {renderMessageWithLinks(message)}
            </div>
            
            {/* Show more/less button for long messages */}
            {message.length > 300 && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="flex items-center mt-1 text-xs font-medium text-blue-600 hover:underline"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={14} className="mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1" />
                    Show more
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-1">
              {attachments.map((attachment, index) => renderAttachment(attachment, index))}
            </div>
          )}
          
          {/* Timestamp */}
          <div 
            className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}
            aria-label="Message time"
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;