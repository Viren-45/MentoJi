// components/ai-match/ai-match-modal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Sparkles } from 'lucide-react';
import ChatMessage from './chat-message';
import ChatTyping from './chat-typing';
import { AIMatchService, CollectedData, AIMessage } from '@/components/ai-match/ai-match-service';

interface AIMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: CollectedData) => void;
}

const AIMatchModal: React.FC<AIMatchModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [conversationComplete, setConversationComplete] = useState(false);
  const [collectedData, setCollectedData] = useState<CollectedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const aiService = useRef(AIMatchService.getInstance());

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize conversation when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen]);

  const initializeConversation = async () => {
    setIsTyping(true);
    setError(null);
    
    try {
      const initialMessage = await aiService.current.getInitialMessage();
      
      setTimeout(() => {
        const aiMessage: AIMessage = {
          id: 'initial',
          type: 'ai',
          message: initialMessage,
          timestamp: new Date()
        };
        
        setMessages([aiMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (err) {
      setError('Failed to start conversation. Please try again.');
      setIsTyping(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim() || isTyping) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: textInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = textInput;
    setTextInput('');
    setIsTyping(true);
    setError(null);

    try {
      const aiResponse = await aiService.current.sendMessage(currentInput);
      
      setTimeout(() => {
        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          message: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);

        if (aiService.current.isConversationComplete(aiResponse)) {
          const data = aiService.current.parseCollectedData(aiResponse);
          if (data) {
            setCollectedData(data);
            setConversationComplete(true);
          }
        }
      }, 1500);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleComplete = () => {
    if (collectedData && onComplete) {
      onComplete(collectedData);
    }
    handleClose();
  };

  const handleClose = () => {
    setMessages([]);
    setIsTyping(false);
    setTextInput('');
    setConversationComplete(false);
    setCollectedData(null);
    setError(null);
    aiService.current.reset();
    onClose();
  };

  const resetConversation = () => {
    setMessages([]);
    setIsTyping(false);
    setTextInput('');
    setConversationComplete(false);
    setCollectedData(null);
    setError(null);
    aiService.current.reset();
    initializeConversation();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with stronger blur and darkness */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-lg"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-[800px] flex flex-col">
        {/* Enhanced glassmorphism with better contrast */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl" />
        
        {/* Content */}
        <div className="relative flex flex-col h-full rounded-3xl overflow-hidden">
          {/* Header with solid background for better readability */}
          <div className="flex items-center justify-between p-6 bg-white backdrop-blur-sm border-b border-gray-300">
            <div className="flex items-center space-x-3">
              {/* Enhanced AI Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl blur-md opacity-60 animate-pulse" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">AI Expert Matcher</h3>
                <p className="text-sm text-gray-700">
                  {conversationComplete ? 'Summary Ready' : 'Finding your perfect expert'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-red-200 rounded-xl transition-colors cursor-pointer text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-900/50 border border-red-500/50 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-red-200">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs text-red-300 hover:text-red-200 mt-2 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Chat Messages with darker background */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-white"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
            }}
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))}
            
            {isTyping && <ChatTyping />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section with solid background */}
          {!conversationComplete && (
            <div className="p-6 bg-white backdrop-blur-sm border-t border-gray-300">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your answer..."
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-12 px-4 backdrop-blur-sm"
                  />
                </div>
                <Button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-xl h-12 px-6 shadow-lg disabled:opacity-50 disabled:hover:from-purple-500 disabled:hover:to-blue-500 cursor-pointer"
                >
                    Send
                    <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Completed State Actions */}
          {conversationComplete && (
            <div className="p-6 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/50 space-y-3">
              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold h-12 rounded-xl shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Find My Experts
              </Button>
              <Button
                onClick={resetConversation}
                className="w-full bg-gray-700/70 hover:bg-gray-600/70 text-white border border-gray-600/50 h-12 rounded-xl backdrop-blur-sm"
              >
                Start Over
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMatchModal;