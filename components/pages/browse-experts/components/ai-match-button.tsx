// components/pages/browse-experts/components/ai-match-button.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface AIMatchButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const AIMatchButton = ({ onClick, disabled = false, className = "" }: AIMatchButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Animated Background Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      
      <Button
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative bg-gradient-to-r from-purple-500 to-blue-600 
          hover:from-purple-600 hover:to-blue-700 
          text-white font-semibold px-6 py-3 rounded-xl 
          shadow-lg hover:shadow-xl 
          transition-all duration-300 
          transform hover:scale-105 hover:-translate-y-1
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          overflow-hidden
          ${className}
        `}
      >
        {/* Animated Shimmer Effect */}
        <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Button Content */}
        <div className="relative flex items-center space-x-2">
          {/* Animated Sparkles */}
          <div className="relative">
            <Sparkles className={`w-5 h-5 transition-transform duration-300 ${
              isHovered ? 'rotate-12 scale-110' : ''
            }`} />
            
            {/* Floating Sparkle Animation */}
            {isHovered && (
              <>
                <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300 animate-ping" />
                <Zap className="absolute -bottom-1 -left-1 w-2 h-2 text-yellow-300 animate-pulse" />
              </>
            )}
          </div>
          
          <span className="text-sm font-semibold">
            AI Match Me
          </span>
          
          {/* Animated Arrow */}
          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
            isHovered ? 'translate-x-1' : ''
          }`} />
        </div>
        
        {/* Pulse Effect on Hover */}
        <div className={`absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`} />
      </Button>
      
      {/* Floating Particles Effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-bounce delay-75" />
          <div className="absolute top-4 right-6 w-1 h-1 bg-blue-300 rounded-full animate-bounce delay-150" />
          <div className="absolute bottom-3 left-8 w-1 h-1 bg-purple-300 rounded-full animate-bounce delay-300" />
        </div>
      )}
    </div>
  );
};

export default AIMatchButton;