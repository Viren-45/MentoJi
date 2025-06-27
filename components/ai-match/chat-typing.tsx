// components/ai-match/chat-typing.tsx
import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const ChatTyping = () => {
  return (
    <div className="flex items-start space-x-4">
      {/* AI Avatar */}
      <div className="relative flex-shrink-0">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl blur-sm opacity-50 animate-pulse" />
        {/* Avatar */}
        <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
          {/* Animated sparkle */}
          <Sparkles className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-yellow-300 animate-spin" />
        </div>
      </div>

      {/* Typing Bubble with better contrast */}
      <div className="relative max-w-xs">
        {/* Solid background for better readability */}
        <div className="bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 rounded-2xl rounded-bl-md px-5 py-4 shadow-lg">
          <div className="absolute inset-0 bg-gray-800/20 rounded-2xl rounded-bl-md" />
          
          <div className="relative flex items-center space-x-2">
            <span className="text-sm text-gray-200">AI is thinking</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
        
        {/* Subtle animation rays */}
        <div className="absolute -inset-2 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-pulse delay-300" />
          <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent transform -translate-x-1/2 -translate-y-1/2 -rotate-45 animate-pulse delay-500" />
        </div>
      </div>
    </div>
  );
};

export default ChatTyping;