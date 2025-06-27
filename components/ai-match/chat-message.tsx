// components/ai-match/chat-message.tsx
import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    type: 'ai' | 'user';
    message: string;
    timestamp: Date;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAI = message.type === 'ai';
  const isUser = message.type === 'user';

  return (
    <div className={`flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {isAI && (
        <div className="relative flex-shrink-0">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl blur-sm opacity-40" />
          {/* Avatar */}
          <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
            {/* Small sparkle */}
            <Sparkles className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-yellow-300 animate-pulse" />
          </div>
        </div>
      )}

      {isUser && (
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-2 max-w-md sm:max-w-lg">
        {/* Message Bubble with better contrast */}
        <div className={`relative px-5 py-4 rounded-2xl shadow-lg ${
          isAI 
            ? 'bg-white backdrop-blur-xl text-black border border-gray-300 rounded-bl-md' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-blue-500/25'
        }`}>
          {/* Enhanced readability background for AI messages */}
          {isAI && (
            <div className="absolute inset-0 rounded-2xl rounded-bl-md" />
          )}
          
          <div className="relative text-sm leading-relaxed">
            {message.message.split('\n').map((line, index) => (
              <div key={index} className={index > 0 ? 'mt-3' : ''}>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Timestamp with better contrast */}
        <div className={`text-xs text-gray-700 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;